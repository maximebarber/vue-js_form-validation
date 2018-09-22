Vue.use(vuelidate.default)

const oldEnoughAndAlive = validators.between(12, 120)

new Vue
({
    el: '#app',

    data () 
    {
        return {
            form: 
            {
                name: null,
                age: null,
                email: null,
                newsletter: null,
                food: null,
                githubUsername: null,
            }
        }
    },

    // Vuelidate validations
    validations: 
    {
        form: 
        {
            name: 
            {
                required: validators.required
            },

            age: 
            {
                // $v.form.age.required
                required: validators.required,
                // $v.form.age.integer
                integer: validators.integer, 
                // $v.form.age.oldEnoughAndAlive
                oldEnoughAndAlive
            },

            email:
            {
                email: validators.email,
                required: validators.requiredIf(function ()
                {
                    return !!this.form.newsletter
                })
            },

            githubUsername:
            {
                exists(value)
                {
                    if(!validators.helpers.req(value))
                    {
                        return true
                    }
                    return axios.get(`//api.github.com/users/${value}`)
                }
            },

            food:
            {
                pizzaOrBurger: value => value === 'pizza' || value === 'burger' || !validators.helpers.req(value)
            },
        }
    },

    methods: 
    {
        // Logic of when to append 'valid' class
        shouldAppendValidClass(field)
        {
            return !field.$invalid && field.$model && field.$dirty
        },

        // Logic of when to append 'error' class
        shouldAppendErrorClass(field)
        {
            return  field.$error
        },

        submitForm() 
        {
            // Touch all the properties under the form object
            this.$v.form.$touch()
            // if form is not invalid
            if (!this.$v.form.$invalid) 
              console.log('📝 Form Submitted', this.form)
            else 
              console.log('❌ Invalid form')
        }
    }
})