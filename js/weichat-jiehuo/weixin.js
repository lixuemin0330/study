window.Le = {
    //读通讯录
    readContacts: function() {
        var contacts = [],
        contact;
        if (this.allContacts) {
            for (var i in this.allContacts) {
                contact = this.allContacts[i];
                if (contact._index) {
                    contacts[contact._index] = contact.UserName + ":" + (contact.RemarkName || contact.NickName);
                }
            }
            return contacts;
        }
    },
    //存储通讯录对象
    getContactsList: function() {
        var contacts = {},
        contact;
        if (this.allContacts) {
            for (var i in this.allContacts) {
                contact = this.allContacts[i];
                //if (contact._index) {
                contacts[contact.RemarkName || contact.NickName] = contact.UserName;
                //}
            }
            return contacts;
        }
    },
    //初始化
    init: function() {
        this.allContacts = window._contacts;
        this.allContents = window._chatContent;
        this.contacts = this.getContactsList();
        this.toUser = this.contacts['jianwen'];

    },
    //读聊天记录
    readMsg: function(speaker) {
        var contents = this.allContents[speaker],
        content,
        out = [];
        if (contents) {
            for (var i = 0; i < contents.length; i++) {
                content = contents[i];
                if (content.MMUnread) {
                    out.push(content.MMDigest);
                }
            };
            return out.toString();
        }

    },
    //选择联系人
    chooseReceiver: function(toUser) {
        var divs = document.getElementsByClassName("chat_item");
        for (var i = 0; i < divs.length; i++) {
            if (divs[i].getAttribute("data-cm").indexOf(toUser) > 0) {
                divs[i].click();
            }
        };
    },
    //发消息
    sendMsg: function(msg) {
        var scope = angular.element(document.querySelector(".btn.btn_send")).scope();
        scope.editAreaCtn = msg;
        scope.sendTextMessage();
    },
    //发消息给指定的人
    sendMsgTo: function(toUser, msg) {
        this.chooseReceiver(toUser);
        setTimeout("Le.sendMsg('" + msg + "')", 2000);
        //this.sendMsg(msg);
    },
    //播放当前对话第一个未读语音
    playUnread: function() {
        var $receiveList = $("[ng-repeat='message in chatContent']").find('.you');
        for (var i = 0; i < $receiveList.length; i++) {
            var $item = $($receiveList[i]);
            if ("inline-block" == $item.find('i.web_wechat_noread').css('display')) {
                $item.find('.voice').click();
                break;
            }
        };
    },
    /****************************连续播放START**************************************/
    //拿到未读的语音列表
    getUnreadList: function() {
        var $receiveList = $("[ng-repeat='message in chatContent']").find('.you'),
        list = [],
        index = 0;
        Le.booleanList = {};
        for (var i = 0; i < $receiveList.length; i++) {
            var $item = $($receiveList[i]);
            if ("inline-block" == $item.find('i.web_wechat_noread').css('display')) {
                list.push($item);
                Le.booleanList[index++] = "unread";
            }
        };
        return list;
    },
    //轮询检查是否播放完，标记当前状态(unread,playing,done)
    checkStop: function(item, i) {
        function v() {
            if ("url(https://res.wx.qq.com/zh_CN/htmledition/v2/images/icon/sprite28a2f7.png)" == item.find('i').css('background-image')) {
                Le.booleanList[i] = "done";
            } else {
                setTimeout(v, 1000);
                Le.booleanList[i] = "playing";
            }
        }
        setTimeout(v, 1000);
    },
    //播放
    playUnread: function(list, i) {
        var $item = $(list[i]);
        if ("inline-block" == $item.find('i.web_wechat_noread').css('display')) {
            $item.find('.voice').click();
            this.checkStop($item, i);
        }
    },
    //是否正在播放
    isPlaying: function() {
        for (var i in Le.booleanList) {
            if ("playing" == Le.booleanList[i]) {
                return true;
            }
        };
        return false;
    },
    //是否存在未读语音
    hasUnread: function() {
        for (var i in Le.booleanList) {
            if ("unread" == Le.booleanList[i]) {
                return i * 1;
            }
        };
        return - 1;
    },
    //连续播放控制
    playNext: function(playList) {
        var me = this;
        function v() {
            var iTime, unread = me.hasUnread(),
            playing = me.isPlaying();
            if (!playing && unread >= 0) {
                me.playUnread(playList, unread);
                iTime = setTimeout(v, 1000);
            } else if (unread == -1) {
                clearTimeout(iTime);
                return;
            } else if (playing) {
                iTime = setTimeout(v, 1000);
            }
        }
        setTimeout(v, 1000);

    },
    //连续播放入口
    playAll: function() {
        var playList = this.getUnreadList();
        this.playNext(playList);
    }
    /****************************连续播放END**************************************/

};

Le.init();
//读通讯录
//Le.readContacts();
//读聊天记录
//Le.readMsg(Le.toUser);
//发消息给指定的人
//Le.sendMsgTo(Le.toUser,"sdfsdf");
//读当前对话第一个未读语音
//Le.playUnread();
//连续播放当前未读
//Le.playAll();
