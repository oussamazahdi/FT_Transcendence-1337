function createSecretBox(secretPassword) {
  let content = "Gold Coin"; 

  return function(guess) {
    if (guess === secretPassword) {
      return "Access Granted! Here is your: " + content;
    } else {
      return "Access Denied! I don't know you.";
    }
  };
}

const myBox = createSecretBox("pizza123");
console.log(myBox);

// TEST 1: Try to access the variable directly
// In Node.js, we wrap this in try/catch because accessing an undefined variable crashes the script
try {
    console.log(content); 
} catch (error) {
    console.log("TEST 1: Can I see the content? NO. It is private.");
}

// TEST 2: Wrong password
console.log("TEST 2: Wrong password ->", myBox("123456")); 

// TEST 3: Right password
console.log("TEST 3: Right password ->", myBox("pizza123"));