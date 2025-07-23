### Test Users

| Username   | Password  | Purpose                 |
|------------|-----------|-------------------------|
| testuser1  | 1234      | Basic login test        |
| member     | chocofan  | Discount test           |
| wronguser  | abc       | Nonexistent user        |
| testuser1  | wrongpass | Incorrect password test |

--------------------------------------------------------------------------------------------------------------------------------------------

### Sample Cart Actions

| Action                     | Description                       |
|----------------------------|-----------------------------------|
| Add "Spicy Chocolate"      | Test item appears in cart         |
| Add 2 "Gummy Chocolate"    | Quantity increases correctly      |
| Clear cart                 | Cart resets and total is 0        |

--------------------------------------------------------------------------------------------------------------------------------------------

### Test Case: TC001 - Successful Login

**Description:** User can log in with valid credentials
**Steps:**
1. Click Sign In
2. Enter username: `testuser1`
3. Enter password: `1234`
4. Click submit

**Expected Result:**
User is logged in and sees greeting:
_“Hey! testuser1, have a chocotastic day”_

--------------------------------------------------------------------------------------------------------------------------------------------

### Test Case: TC2 - Login with Wrong Password

**Steps:**
1. Username: `testuser1`
2. Password: `wrongpass`
3. Click submit

**Expected Result:**
Alert shows “Incorrect password”

--------------------------------------------------------------------------------------------------------------------------------------------

### Test Case: TC3 - Membership Discount

**Description:** Logged-in users get €5 discount
**Steps:**
1. Log in as `member`
2. Add any chocolate to cart

**Expected Result:**
Discount line appears: `Membership Discount – €5.00`
Final total is reduced

--------------------------------------------------------------------------------------------------------------------------------------------

### Test Case: TC4 - Clear Cart

**Steps:**
1. Add at least one item to cart
2. Click the trash can icon

**Expected Result:**
All cart items are removed
Total resets to `€0.00`

--------------------------------------------------------------------------------------------------------------------------------------------