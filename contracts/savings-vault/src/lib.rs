#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Symbol};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DepositRecord {
    pub user: Address,
    pub amount: i128,
    pub timestamp: u64,
}

#[contracttype]
pub enum DataKey {
    Admin,
    TotalDeposited,
    UserBalance(Address),
    DepositCount(Address),
    DepositRecord(Address, u32),
}

#[contract]
pub struct SavingsVaultContract;

#[contractimpl]
impl SavingsVaultContract {
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&DataKey::Admin) {
            panic!("Contract already initialized");
        }

        admin.require_auth();

        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage()
            .instance()
            .set(&DataKey::TotalDeposited, &0_i128);
    }

    pub fn deposit(env: Env, user: Address, amount: i128) -> bool {
        user.require_auth();

        if amount <= 0 {
            panic!("Deposit amount must be greater than zero");
        }

        let current_balance: i128 = env
            .storage()
            .persistent()
            .get(&DataKey::UserBalance(user.clone()))
            .unwrap_or(0);

        let new_balance = current_balance + amount;

        env.storage()
            .persistent()
            .set(&DataKey::UserBalance(user.clone()), &new_balance);

        let total_deposited: i128 = env
            .storage()
            .instance()
            .get(&DataKey::TotalDeposited)
            .unwrap_or(0);

        env.storage()
            .instance()
            .set(&DataKey::TotalDeposited, &(total_deposited + amount));

        let deposit_count: u32 = env
            .storage()
            .persistent()
            .get(&DataKey::DepositCount(user.clone()))
            .unwrap_or(0);

        let record = DepositRecord {
            user: user.clone(),
            amount,
            timestamp: env.ledger().timestamp(),
        };

        env.storage().persistent().set(
            &DataKey::DepositRecord(user.clone(), deposit_count),
            &record,
        );

        env.storage()
            .persistent()
            .set(&DataKey::DepositCount(user.clone()), &(deposit_count + 1));

        env.events().publish(
            (Symbol::new(&env, "deposit"), user.clone()),
            amount,
        );

        true
    }

    pub fn get_user_balance(env: Env, user: Address) -> i128 {
        env.storage()
            .persistent()
            .get(&DataKey::UserBalance(user))
            .unwrap_or(0)
    }

    pub fn get_total_deposited(env: Env) -> i128 {
        env.storage()
            .instance()
            .get(&DataKey::TotalDeposited)
            .unwrap_or(0)
    }

    pub fn get_deposit_count(env: Env, user: Address) -> u32 {
        env.storage()
            .persistent()
            .get(&DataKey::DepositCount(user))
            .unwrap_or(0)
    }

    pub fn get_deposit_record(env: Env, user: Address, index: u32) -> DepositRecord {
        env.storage()
            .persistent()
            .get(&DataKey::DepositRecord(user, index))
            .expect("Deposit record not found")
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_initialize_contract() {
        let env = Env::default();
        let contract_id = env.register(SavingsVaultContract, ());
        let client = SavingsVaultContractClient::new(&env, &contract_id);

        let admin = Address::generate(&env);

        env.mock_all_auths();

        client.initialize(&admin);

        assert_eq!(client.get_total_deposited(), 0);
    }

    #[test]
    fn test_deposit_updates_user_balance() {
        let env = Env::default();
        let contract_id = env.register(SavingsVaultContract, ());
        let client = SavingsVaultContractClient::new(&env, &contract_id);

        let user = Address::generate(&env);

        env.mock_all_auths();

        client.deposit(&user, &100);

        assert_eq!(client.get_user_balance(&user), 100);
    }

    #[test]
    fn test_deposit_updates_total_deposited() {
        let env = Env::default();
        let contract_id = env.register(SavingsVaultContract, ());
        let client = SavingsVaultContractClient::new(&env, &contract_id);

        let user = Address::generate(&env);

        env.mock_all_auths();

        client.deposit(&user, &100);
        client.deposit(&user, &50);

        assert_eq!(client.get_total_deposited(), 150);
    }

    #[test]
    fn test_deposit_record_is_saved() {
        let env = Env::default();
        let contract_id = env.register(SavingsVaultContract, ());
        let client = SavingsVaultContractClient::new(&env, &contract_id);

        let user = Address::generate(&env);

        env.mock_all_auths();

        client.deposit(&user, &75);

        let record = client.get_deposit_record(&user, &0);

        assert_eq!(record.user, user);
        assert_eq!(record.amount, 75);
        assert_eq!(client.get_deposit_count(&user), 1);
    }
}