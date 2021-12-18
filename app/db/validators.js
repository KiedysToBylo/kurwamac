const checkForbidenString = (value, forbidenString) => {
    if (value === forbidenString) {
      throw new Error('Nazwa "Slug" jest zakazana!');
    }
  };

  function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }


  export {
      checkForbidenString,
      isValidEmail,
  }
