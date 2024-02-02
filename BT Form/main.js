
function validator (options) {

    // 
    var selectorRules = {};

    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
         var errorMassage;

        //  lấy ra các rules của selector
        var rules = selectorRules[rule.selector]

        // lặp qua từng rules & ktra
        // nếu có lỗi thì dừng việc ktra
        for( var i = 0; i < rules.length; i++) {
            errorMassage = rules[i](inputElement.value)

            if (errorMassage) break;
        }


            if(errorMassage) {
                errorElement.innerText = errorMassage;
                inputElement.parentElement.classList.add('invalid')
            }else {
                errorElement.innerText = '';
                inputElement.parentElement.classList.remove('invalid')
            }
        return !errorMassage;
    }

    // Lấy element của form cần validate
    var formElement = document.querySelector(options.form)
    if(formElement) {

        // khi submit form loại bỏ hành vi mặt định
        formElement.onsubmit = function(e) {
            e.preventDefault();

            var isFormValid = true;

            // lặp qua từng rula và validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if(!isValid) {
                    isFormValid = false
                }
            });

            

            if(isFormValid) {

                // trường hợp submit với javascript
                if (typeof options.onSubmit === 'function') {
                    var enableInput = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInput).reduce(function (values, input) {
                        (values[input.name] = input.value)
                        return  values;
                }, {});
                    options.onSubmit(formValues)
                }

                // Trường hợp submit với hành vi mặt định
                else {
                    formElement.submit();
                }
            }
            
        }

        

        // lặp qua mỗi rules và xử lý ( lắng nghe sự kiện onblur, input,.....)
        options.rules.forEach(function (rule) {

            // lưu laị các rule cho mỗi input
            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            }else {
                selectorRules[rule.selector] = [rule.test];
            }


            var inputElement = formElement.querySelector(rule.selector);

            if(inputElement) {

                // xử lý trường hợp blur khỏi input
                inputElement.onblur = function () {
                    validate(inputElement, rule);
                }

                // xử lý mỗi khi người dùng nhập vào input
                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector)

                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        });
    }
}










validator.isRequired = function (selector,massage) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : massage || 'Vui lòng nhập trường này'
        }
    }
}

validator.isEmail = function (selector,massage) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : massage || 'Trường này phải là Email'    
        }
    }
}

validator.minLength = function (selector, min,massage) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : massage || `Vui lòng nhập tối thiểu ${min} kí tự`
        }
    }
}
7
validator.isConfirmed = function (selector, getConfirmValue, massage) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : massage || 'Giá trị nhập vào chưa đúng'
        }
    }
}