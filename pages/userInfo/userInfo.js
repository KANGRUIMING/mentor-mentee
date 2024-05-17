Page({
    data: {
      role: '',
      name: '',
      eid: '',
      year: '',
      major: '',
      photo: '',
      openid: ''
    },
    onLoad(options) {
      this.setData({
        role: options.role,
        openid: options.openid
      });
    },
    handleInput: function(e) {
      const field = e.currentTarget.dataset.field;
      this.setData({
        [field]: e.detail.value
      });
    },
    chooseImage: function() {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          const tempFilePaths = res.tempFilePaths;
          this.setData({
            photo: tempFilePaths[0]
          });
        }
      });
    },
    submitInfo: function() {
      const { name, eid, year, major, photo, role, openid } = this.data;
      if (!name || !eid || !year || !major || !photo) {
        wx.showToast({
          title: '请填写所有信息',
          icon: 'none',
          duration: 2000
        });
        return;
      }
  
      // 上传照片并提交信息
      wx.uploadFile({
        url: 'http://localhost:3000/upload', // 替换为你自己的服务器接口
        filePath: photo,
        name: 'photo',
        formData: {
          name,
          eid,
          year,
          major,
          role,
          openid
        },
        success: res => {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          });
          // 跳转到主页面
          wx.switchTab({
            url: '/pages/main/main'
          });
        },
        fail: error => {
          wx.showToast({
            title: '提交失败',
            icon: 'none',
            duration: 2000
          });
        }
      });
    }
  });
  