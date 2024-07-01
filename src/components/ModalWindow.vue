<template>
    <div :class="`window_wrap ${modal || modalCard ? '_visible' : ''}`">
        <div v-if="modal">
            <label>{{ $t('Do you want to delete this card?') }}</label>
            <div>
                <button @click="cancelDelete">{{ $t('Cancel') }}</button>
                <button @click="deleteCard">{{ $t('Delete') }}</button>
            </div>
        </div>
        <div v-if="modalCard">
            {{ $t('Maximum 5 selected cities!') }}
        </div>
    </div>
</template>

<script>
export default {
    name: 'ModalWindow',
    props: {
        modal: {
            type: Boolean,
            default: false
        },
        deleteCard: {
            type: Function,
            required: false
        },
        modalCard: {
            type: Boolean,
            required: false
        }
    },
    methods: {
        cancelDelete() {
            this.$emit('close-modal');
        }
    }
}
</script>

<style scoped>
.window_wrap {
    display: none;
}

.window_wrap._visible {
    position: fixed;
    z-index: 999;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    margin: 0 auto;
    top: 50px;
    width: 300px;
    height: 200px;
    color: rgb(184, 45, 45);
    border: 1px solid black;
    border-radius: 10px;
    background-color: rgb(224, 193, 193);
    transition: transform 0.3s ease;
}

.window_wrap._visible {
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
}

.window_wrap._visible.visible {
    opacity: 1;
}

.window_wrap._visible {
    opacity: 0;
    animation: fadeInOut 0.5s ease-in-out forwards;
}

@keyframes fadeInOut {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.window_wrap>div,
.window_wrap._visible>div {
    display: flex;
    flex-direction: column;
}

.window_wrap>div>div {
    margin: 25px auto 0;
    width: max-content;

}

.window_wrap button,
.window_wrap._visible button {
    padding: 10px;
    cursor: pointer;
    border-radius: 10px;
    border: 1px solid gray;
    margin: 20px;
    width: 100px;
    font-size: 16px;
    font-weight: 600;
    color: brown;
    transition: 300ms;
}

.window_wrap button:hover,
.window_wrap._visible button:hover {
    background-color: rgb(255, 244, 215);
}
</style>
