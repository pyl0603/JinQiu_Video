import Loadings from './index'
import Vue from 'vue'

let instance
const LoadingConst = Vue.extend(Loadings);

instance = new LoadingConst({
    el: document.createElement('div')
})

instance.show = false;

const loading = {
    show(options = {}) {
        instance.show = true;
        if (options) {
            options.el.appendChild(instance.$el);
        }
    },
    hide() {
        instance.show = false;
    }
}

export default {
    install() {
        if (!Vue.$loading) {
            Vue.$loading = loading;
        }
        Vue.mixin({
            created() {
                this.$loading = Vue.$loading;
            }
        })
    }
}