Page({
    data: {
      name: '',
      eid: '',
      year: '',
      major: '',
      wechat: '',
      photo: '',
      roleText: ''
    },
    onLoad() {
      const openid = wx.getStorageSync('openid');
      if (openid) {
        wx.request({
          url: 'http://localhost:3000/getuserinfo',
          method: 'POST',
          data: {
            openid: openid
          },
          header: {
            'content-type': 'application/json'
          },
          success: res => {
            if (res.data.success) {
              const roleText = res.data.user.role ? '导师' : '学生';
              // 设置图片路径为服务器上的完整路径
              const photoPath = `http://localhost:3000/${res.data.user.photo}`;
              this.setData({
                name: res.data.user.name,
                eid: res.data.user.eid,
                year: res.data.user.year,
                major: res.data.user.major,
                wechat: res.data.user.wechat,
                photo: photoPath,
                roleText: roleText
              });
            } else {
              wx.showToast({
                title: '获取用户信息失败',
                icon: 'none',
                duration: 2000
              });
            }
          },
          fail: error => {
            console.error('获取用户信息失败', error);
            wx.showToast({
              title: '获取用户信息失败',
              icon: 'none',
              duration: 2000
            });
          }
        });
      } else {
        wx.showToast({
          title: '用户未登录',
          icon: 'none',
          duration: 2000
        });
      }
    }
  });
