var app=getApp()
Page({
  data: {
    userInfo: {},
    selectAll:true,
    totalsum:0,
    totalnum:0,
    loadingHidden: false
  },
  //事件处理函数
  bindMinus:function(e){
    var $index=parseInt(e.currentTarget.dataset.index);
    var num=this.data.userShopcarSocks[$index].num;
    if(num>0){
      num--;
    }
    var minsStatus=num<=0?true:false;
    var minusStatuses=this.data.minusStatuses;
    minusStatuses[$index]=minsStatus;
    var userShopcarSocks = this.data.userShopcarSocks;
    userShopcarSocks[$index].num = num;
    this.setData({
      userShopcarSocks:userShopcarSocks,
      minusStatuses:minusStatuses
    })
    if(this.data.userShopcarSocks[$index].selected){
      this.getTotal();
    }
  },
  bindPlus:function(e){
    var $index = parseInt(e.currentTarget.dataset.index);
    var num = this.data.userShopcarSocks[$index].num;
    num++;
    var minsStatus = num <= 0 ? true : false;
    var minusStatuses = this.data.minusStatuses;
    minusStatuses[$index] = minsStatus; 
    var userShopcarSocks = this.data.userShopcarSocks;
    userShopcarSocks[$index].num = num;
    this.setData({
      userShopcarSocks: userShopcarSocks,
      minusStatuses:minusStatuses
    })
    if (this.data.userShopcarSocks[$index].selected) {
      this.getTotal();
    }
  },
  bindSelectOne:function(e){
    var $index=parseInt(e.currentTarget.dataset.index);
    var selected=this.data.userShopcarSocks[$index].selected;
    selected=!selected;
    var userShopcarSocks=this.data.userShopcarSocks;
    userShopcarSocks[$index].selected=selected;
    this.setData({
      userShopcarSocks:userShopcarSocks
    });
    this.getTotal();
  },
  bindSelectAllhah:function(){
    var $selectAll=this.data.selectAll;
    $selectAll=!$selectAll;
    var $userShopcarSocks=this.data.userShopcarSocks;
    if($selectAll){
      for (var i = 0, len = $userShopcarSocks.length; i < len; i++) {
         $userShopcarSocks[i].selected=true;
      }
    }else{
      for (var i = 0, len = $userShopcarSocks.length; i < len; i++) {
        $userShopcarSocks[i].selected = false;
      }
    }
    this.setData({
      selectAll: $selectAll,
      userShopcarSocks:$userShopcarSocks
    })
    this.getTotal();
  },
  bindbuynow:function(){
      var $buyShopcarSocks=[];
      var $userShopcarSocks=this.data.userShopcarSocks;
      var j=0;
      console.log("shopcar's length is "+$userShopcarSocks);
      for(var i=0,len=$userShopcarSocks.length;i<len;i++){
         if($userShopcarSocks[i].selected){
           $buyShopcarSocks[j++]=$userShopcarSocks[i];
         }
      }
      console.log("shopcar is "+$buyShopcarSocks);
      wx.setStorageSync("buyShopcarSocks",$buyShopcarSocks);
      wx.navigateTo({
        url:'../confirmorder/confirmorder?totalnum='+this.data.totalnum+'&totalsum='+this.data.totalsum+'&buyShopcarSocks='+$buyShopcarSocks
      });
  },
  getTotal:function(){
    //计算总价价格总件数
    var $userShopcarSocks = this.data.userShopcarSocks;
    var $totalnum = 0;
    var $totalsum = 0;
    var $count = 0;
    var $selectAll = false;
    for (var i = 0, len = $userShopcarSocks.length; i < len; i++) {
      if ($userShopcarSocks[i].selected) {
        console.log("结算");
        $count++;
        $totalnum += $userShopcarSocks[i].num;
        $totalsum += parseFloat($userShopcarSocks[i].sock.price * $userShopcarSocks[i].num);
      }
    }
    if ($count == len) {
      $selectAll = true;
    }
    this.setData({
      totalnum: $totalnum,
      totalsum: $totalsum.toFixed(2),
      selectAll: $selectAll
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    var $openid=wx.getStorageSync("user").openid;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    });
  },
  onShow:function(){
    //获取初始化数据
    var $openid=wx.getStorageSync("user").openid;
    var that=this;
    wx.request({
      url: app.globalData.serverPath + 'wechat/findUserShopcarSocks?openid=' + $openid,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        console.log(res.data.userShopcarSocks);
        //修改合适数据
        var minusStatuses=[];
        for (var i = 0, len = res.data.userShopcarSocks.length;i<len;i++){
          if (res.data.userShopcarSocks[i].sock.title.length>10){
            res.data.userShopcarSocks[i].sock.title = res.data.userShopcarSocks[i].sock.title.substring(0,9)+"...";
          }
          if (res.data.userShopcarSocks[i].selected=="true"){
            res.data.userShopcarSocks[i].selected=true;
          }else{
            res.data.userShopcarSocks[i].selected = false;
          }
          minusStatuses[i]=false;
        }
        that.setData({
          userShopcarSocks: res.data.userShopcarSocks,
          sockPicUrl: app.globalData.serverPath + "img/uploadSockImg/",
          minusStatuses:minusStatuses
        });
        that.getTotal();
        setTimeout(function () {
          that.setData({
            loadingHidden: true
          })
        }, 1500)
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    });
  }
})