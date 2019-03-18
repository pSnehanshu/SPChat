//Components
Vue.component('msg',{
    template:`
        <div :class="['chat', chatAlign]">
            <b>{{sender}}</b> {{message}}
        </div>
    `,
    props:['text', 'sender', 'type'],
    computed:{
        message(){
            return this.text
        },
        chatAlign(){
            switch(this.type.trim().toLowerCase()){
                case 'received': return 'chat-left'; break
                case 'sent': return 'chat-right'; break;
                default: return 'chat-center' //Notification 
            }
        }
    }
})

Vue.component('msgbox',{
    template:`
        <div class="msgbox">
            <form @submit.prevent="onSubmit">
                <input type="text" v-model="message" placeholder="Type a message...">
                <button>Send</button>
            </form>
        </div>
    `,
    data(){
        return {
            message:'',
        }
    },
    methods:{
        onSubmit(){
            var message = this.message.trim()

            if (message.length>0){
                this.$emit('submit', message)
                this.message = ''
            }
        }
    }
})



//Main App
const spchat = new Vue({
    el:'#spchat',
    data:{
        name:null,
        socket:null,
        messages:[]
    },
    methods:{
        sendMsg(msg){
            var data = {
                sender: this.name,
                message: msg
            }

            this.socket.emit('send', data)

            data.type = 'sent'
            this.messages.push(data)
            this.scrollBottom()
        },
        scrollBottom(){
            var chatbox = this.$el.querySelector("#chat-window");
            setTimeout(function(){
                chatbox.scrollTop = chatbox.scrollHeight;
            }, 200)
        },
        notify: (function () {
            var oldTitle = document.title
            var timeoutId
            var clear = function() {
                clearInterval(timeoutId)
                document.title = oldTitle
                window.onmousemove = null
                timeoutId = null
            }
            return function (msg = 'New message!') {
                if (!timeoutId) {
                    timeoutId = setInterval(function() {
                        document.title = document.title == msg ? oldTitle : msg
                    }, 800)
                    window.onmousemove = clear
                }
            }
        }()),
    },
    mounted(){
        do{
            this.name = prompt('What\'s your name?').trim()
        } while (this.name.length <= 0)

        this.socket = io()

        this.socket.emit('joined', this.name)

        this.socket.on('receive', data =>{
            data.type = 'received'
            this.messages.push(data)
            this.scrollBottom()
            this.notify(`[${data.sender} sent a message]`)
        })

        this.socket.on('joined', name => {
            this.messages.push({
                sender:name,
                message: 'has joined',
                type: 'notification'
            })
            this.scrollBottom()
        })

        this.socket.on('left', name => {
            this.messages.push({
                sender: name,
                message: 'has left',
                type: 'notification'
            })
        })
    } 
})

