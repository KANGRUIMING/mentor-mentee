Page({
    onGetUserInfo: function(e) {
      const role = e.currentTarget.dataset.role;
      if (e.detail.userInfo) {
        // 调用微信登录接口
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            console.log(res.code);
            wx.request({
              url: 'http://192.168.0.103:3000/getopenid', //仅为示例，并非真实的接口地址
              data: {
                code: res.code
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: res => {
                console.log(res.data);
                const customSession = res.data.customSession;
                wx.setStorageSync('customSession', customSession);
  
                // 存储用户角色和信息
                wx.setStorageSync('userInfo', {
                  ...e.detail.userInfo,
                  role: role
                });
  
                wx.showToast({
                  title: `登录成功，身份：${role === 'teacher' ? '老师' : '学生'}`,
                  icon: 'success',
                  duration: 2000
                });
  
                // 跳转到主页面
                wx.switchTab({
                  url: '/pages/main/main'
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
  