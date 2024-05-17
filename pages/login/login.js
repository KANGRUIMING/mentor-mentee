Page({
    onLoad: function() {
      const openid = wx.getStorageSync('openid');
      if (openid) {
        // 本地已有 openid，检查用户是否已经注册
        wx.request({
          url: 'http://localhost:3000/checkuser',
          method: 'POST',
          data: {
            openid: openid
          },
          header: {
            'content-type': 'application/json'
          },
          success: res => {
            if (res.data.exists) {
              // 用户已经注册，直接登录
              wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 2000
              });
              // 跳转到主页面
              wx.switchTab({
                url: '/pages/main/main'
              });
            } else {
              // 本地有 openid 但用户未注册，重新登录
              wx.removeStorageSync('openid');
            }
          },
          fail: error => {
            console.error('检查用户失败', error);
            wx.showToast({
              title: '登录失败',
              icon: 'none',
              duration: 2000
            });
          }
        });
      }
    },
    
    onGetUserInfo: function(e) {
      const role = e.currentTarget.dataset.role;
      if (e.detail.userInfo) {
        // 调用微信登录接口
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            console.log(res.code);
            wx.request({
              url: 'http://localhost:3000/getopenid', //仅为示例，并非真实的接口地址
              data: {
                code: res.code
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: res => {
                console.log(res.data);
                const openid = res.data.openid;
                wx.setStorageSync('openid', openid);
  
                // 检查用户是否已经注册
                wx.request({
                  url: 'http://localhost:3000/checkuser', // 你的检查用户接口地址
                  method: 'POST', // 使用 POST 方法
                  data: {
                    openid: openid
                  },
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success: res => {
                    if (res.data.exists) {
                      // 用户已经注册，直接登录
                      wx.showToast({
                        title: '登录成功',
                        icon: 'success',
                        duration: 2000
                      });
                      // 跳转到主页面
                      wx.switchTab({
                        url: '/pages/main/main'
                      });
                    } else {
                      // 用户未注册，跳转到注册页面
                      wx.navigateTo({
                        url: `/pages/userInfo/userInfo?role=${role}&openid=${openid}`
                      });
                    }
                  },
                  fail: error => {
                    console.error('检查用户失败', error);
                    wx.showToast({
                      title: '登录失败',
                      icon: 'none',
                      duration: 2000
                    });
                  }
                });
              },
              fail: error => {
                console.error('获取 openid 失败', error);
                wx.showToast({
                  title: '登录失败',
                  icon: 'none',
                  duration: 2000
                });
              }
            });
          }
        });
      } else {
        wx.showToast({
          title: '登录失败',
          icon: 'none',
          duration: 2000
        });
      }
    }
  });
  