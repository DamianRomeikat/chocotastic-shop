const menuOpenButton = document.querySelector("#menu-open-button");
const menuCloseButton = document.querySelector("#menu-close-button");

menuOpenButton.addEventListener("click", () => {
    // toggle for mobile menu
    document.body.classList.toggle("show-mobile-menu");
});

//close menu when button is clicked
menuCloseButton.addEventListener("click", () => menuOpenButton.click());

//initialize swiper
const swiper = new Swiper('.slider-wrapper', {
    loop: true,
    grabCursor: true,
    spaceBetween: 25,

  // If we need pagination
pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true,
},

  // Navigation arrows
navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
},

//responsive breakpoints
breakpoints: {
    0: {
        slidesPerView: 1
    },
    768: {
        slidesPerView: 2
    },
    1024: {
        slidesPerView: 3
    },

}
});

//shows what is actually in the backend of the cart
function renderCartFromBackend() {
    fetch('http://localhost:5000/api/cart')
        .then(res => res.json())
        .then(data => {
            const cartItemsContainer = document.getElementById('cart-items');
            const closeButton = document.getElementById('close-cart');
            const cartBox = document.getElementById('cart');

            cartItemsContainer.innerHTML = '';

            if (data.length === 0) {
                const li = document.createElement('li');
                li.textContent = 'Cart is empty';
                cartItemsContainer.appendChild(li);

                // Show close button
                closeButton.style.display = 'block';
    } else {
        let total = 0;

        data.forEach(item => {
            const li = document.createElement('li');
            const itemTotal = item.quantity * 10;
            li.textContent = `${item.name} x ${item.quantity} – €${itemTotal.toFixed(2)}`;
            cartItemsContainer.appendChild(li);
            total += itemTotal;
        });

        // 💶 Show total below items
        // Apply membership discount if logged in
        const isLoggedIn = window.loggedInUser;
        let discount = 0;

            if (isLoggedIn && total > 0) {
        discount = 5;
        const discountItem = document.createElement('li');
        discountItem.textContent = `Membership Discount – €${discount.toFixed(2)}`;
        discountItem.classList.add('discount');
        cartItemsContainer.appendChild(discountItem);
        }

        // Final total after discount
        const finalTotal = total - discount;

        const totalDisplay = document.createElement('li');
        totalDisplay.style.fontWeight = 'bold';
        totalDisplay.style.marginTop = '10px';
        totalDisplay.textContent = `Total: €${finalTotal.toFixed(2)}`;
        cartItemsContainer.appendChild(totalDisplay);

        // Show close button
        closeButton.style.display = 'block';
        closeButton.style.display = 'none';
        cartBox.style.display = 'block';
    }
});
}


// Hook up each "Add to Cart" button
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
        const itemName = button.getAttribute('data-name');

        fetch('http://localhost:5000/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: itemName })
        })
        .then(res => res.json())
        .then(data => {
            alert(`${data.name} added to cart!`);
            renderCartFromBackend(); // Update cart display
        })
        .catch(err => {
            alert('Error adding to cart');
            console.error(err);
        });
    });
});

// Load cart from backend on page load
document.addEventListener('DOMContentLoaded', renderCartFromBackend);

// clear cart feature
document.getElementById('clear-cart').addEventListener('click', () => {
    fetch('http://localhost:5000/api/cart', {
        method: 'DELETE'
    })
    .then(() => {
        alert('Cart cleared!');
        renderCartFromBackend(); // Refresh cart display
    })
    .catch(err => {
        console.error(err);
        alert('Error clearing cart');
    });
});

// for close prompt of cart
document.getElementById('close-cart').addEventListener('click', () => {
    document.getElementById('cart').style.display = 'none';
});


// modal references
let authModal, closeAuthBtn, switchToSignup, authTitle, authSubmit, nameField, toggleText;
let isSignupMode = false;

// Show sign in modal
document.addEventListener('DOMContentLoaded', () => {
authModal = document.getElementById('auth-modal');
closeAuthBtn = document.getElementById('close-auth');
switchToSignup = document.getElementById('switch-to-signup');
authTitle = document.getElementById('auth-title');
authSubmit = document.getElementById('auth-submit');
nameField = document.getElementById('name');
toggleText = document.getElementById('toggle-auth-mode');

document.querySelector('.order-now').addEventListener('click', (e) => {
    e.preventDefault();
    authModal.classList.remove('hidden');
});

closeAuthBtn.addEventListener('click', () => {
    authModal.classList.add('hidden');
});

function updateAuthMode() {
    if (isSignupMode) {
        authTitle.textContent = 'Sign Up';
        authSubmit.textContent = 'Sign Up';
        toggleText.innerHTML = 'Already have an account? <a href="#" id="switch-to-signup">Sign In</a>';
    } else {
        authTitle.textContent = 'Sign In';
        authSubmit.textContent = 'Sign In';
        toggleText.innerHTML = 'Don’t have an account? <a href="#" id="switch-to-signup">Sign Up</a>';
    }

    // Re-bind the toggle click every time text is changed
    document.getElementById('switch-to-signup').addEventListener('click', (e) => {
        e.preventDefault();
        isSignupMode = !isSignupMode;
        updateAuthMode();
    });
}

// run it once at startup to bind initial state
updateAuthMode();


document.getElementById('auth-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const password = document.getElementById('password').value;

    const endpoint = isSignupMode ? 'signup' : 'login';

    fetch(`http://localhost:5000/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);

    if (!isSignupMode && data.message === 'Login successful') {
    document.getElementById('auth-modal').classList.add('hidden');

    // ✅ Get username from server response
    const username = data.user.name;

    // ✅ Store username globally (not in localStorage)
    window.loggedInUser = username;

    // ✅ Update greeting UI
    const navGreeting = document.getElementById('nav-greeting');
    const usernameDisplay = document.getElementById('username-display');
    usernameDisplay.textContent = username;

    navGreeting.classList.remove('hidden');
    navGreeting.classList.add('fade-in');

    // ✅ Hide Sign In button
    document.querySelector('.order-now').classList.add('hidden');

    // ✅ Update cart to reflect discount
    renderCartFromBackend();
}
        if (isSignupMode && data.message === 'User created successfully') {
            document.getElementById('auth-modal').classList.add('hidden');

            // ✅ Get username from server response
            const username = data.user.name;

            // ✅ Store username globally (not in localStorage)
            window.loggedInUser = username;

            // ✅ Update greeting UI
            const navGreeting = document.getElementById('nav-greeting');
            const usernameDisplay = document.getElementById('username-display');
            usernameDisplay.textContent = username;

            navGreeting.classList.remove('hidden');
            navGreeting.classList.add('fade-in');

            // ✅ Hide Sign In button
            document.querySelector('.order-now').classList.add('hidden');

            // ✅ Update cart to reflect discount
            renderCartFromBackend();
        }
    })
    .catch(err => {
        console.error(err);
        alert('Error with authentication');
    });
});

//logout action
document.getElementById('logout-button').addEventListener('click', () => {
    // Hide greeting
    document.getElementById('nav-greeting').classList.add('hidden');

    // Show Sign In button again
    document.querySelector('.order-now').classList.remove('hidden');

    // Optionally reset the modal inputs
    document.getElementById('name').value = '';
    document.getElementById('password').value = '';

    alert('You have been logged out');
});

//closes tab for mobile screens once heading is picked
document.querySelectorAll('.nav-link').forEach(link => {
link.addEventListener('click', () => {
    // If mobile menu is open, close it
    if (document.body.classList.contains('show-mobile-menu')) {
    document.body.classList.remove('show-mobile-menu');
    }
});
});


});

