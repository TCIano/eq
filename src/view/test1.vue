<template>
    <span>秒数</span>
</template>

<script>

export default {
    data() {
        return {
            timer: null,
            number: 0,
            text: JSON.parse(localStorage.getItem('NUM'))
        }
    },
    methods: {
        add() {
            if (!this.lock) {
                localStorage.setItem('LOCK', JSON.stringify(true))
                // clearInterval(this.timer)
                this.timer = setInterval(() => {
                    this.number++
                    console.log(this.number);
                    localStorage.setItem('NUM', JSON.stringify(this.number))

                }, 1000)
            }
        }
    },
    computed: {
        lock() {
            return JSON.parse(localStorage.getItem('LOCK')) || false
        }
    },
    created() {
        this.add()
        window.addEventListener('setItemEvent', (e) => {
            if (e.key === 'NUM') {
                this.text = e.newValue
            }
        })
    }
}
</script> 


<style scoped></style>