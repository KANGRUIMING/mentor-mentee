Page({
    data: {
      name: '',
      eid: '',
      year: '',
      major: '',
      wechat: '',
      photo: '', // 当前头像
      newPhoto: '', // 新头像
      otherInfoText: '',
      otherInfoImage: ''
    },
    onLoad() {
      const openid = wx.getStorageSync('openid');
      if (openid) {
        wx.request({
          url: 'http://localhost:3000/getuserinfo',
          method: 'POST',
          data: { openid },
          header: { 'content-type': 'application/json' },
          success: res => {
            if (res.data.success) {
              const user = res.data.user;
              this.setData({
                name: user.name,
                eid: user.eid,
                year: user.year,
                major: user.major,
                wechat: user.wechat,
                photo: user.photo ? `http://localhost:3000/${user.photo}` : '',
                otherInfoText: user.otherInfo ? user.otherInfo.text : '',
                otherInfoImage: user.otherInfo ? `http://localhost:3000/${user.otherInfo.image}` : ''
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
    },
    bindInputChange(e) {
      const { field } = e.currentTarget.dataset;
      this.setData({ [field]: e.detail.value });
    },
    chooseImage() {
      wx.chooseImage({
        count: 1,
        sourceType: ['album', 'camera'],
        success: res => {
          this.setData({ otherInfoImage: res.tempFilePaths[0] });
        }
      });
    },
    choosePhoto() {
      wx.chooseImage({
        count: 1,
        sourceType: ['album', 'camera'],
        success: res => {
          this.setData({ newPhoto: res.tempFilePaths[0] });
        }
      });
    },
    saveInfo() {
      const openid = wx.getStorageSync('openid');
      if (!openid) {
        wx.showToast({
          title: '用户未登录',
          icon: 'none',
          duration: 2000
        });
        return;
      }
  
      const data = {
        openid,
        name: this.data.name,
        eid: this.data.eid,
        year: this.data.year,
        major: this.data.major,
        wechat: this.data.wechat,
        otherInfoText: this.data.otherInfoText
      };
  
      const uploadPromises = [];
  
      if (this.data.newPhoto) {
        uploadPromises.push(this.uploadFile('newPhoto', this.data.newPhoto, data));
      }
      if (this.data.otherInfoImage) {
        uploadPromises.push(this.uploadFile('otherInfoImage', this.data.otherInfoImage, data));
      }
  
      Promise.all(uploadPromises).then(() => {
        wx.showToast({
          title: '信息更新成功',
          icon: 'success',
          duration: 2000
        });
        // 使用 wx.reLaunch 重新加载页面
        wx.reLaunch({
          url: '/pages/student/home/home'
        });
      }).catch(error => {
        console.error('信息更新失败', error);
        wx.showToast({
          title: '信息更新失败',
          icon: 'none',
          duration: 2000
        });
      });
    },
    uploadFile(name, filePath, formData) {
      return new Promise((resolve, reject) => {
        wx.uploadFile({
          url: 'http://localhost:3000/updateuserinfo',
          filePath,
          name,
          formData,
          success: res => resolve(res),
          fail: error => reject(error)
        });
      });
    }
  });
  