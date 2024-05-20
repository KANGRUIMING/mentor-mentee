Page({
    data: {
      teacher: {}
    },
    onLoad(options) {
      const teacherId = options.id;
      this.getTeacherDetail(teacherId);
    },
    getTeacherDetail(id) {
      wx.request({
        url: `http://localhost:3000/teacher/${id}`, // 使用你的服务器 IP 地址
        method: 'GET',
        success: res => {
          if (res.data.success) {
            const teacher = res.data.teacher;
            if (teacher.photo) {
              teacher.photo = `http://localhost:3000/${teacher.photo}`;
            }
            if (teacher.otherInfo && teacher.otherInfo.image) {
              teacher.otherInfo.image = `http://localhost:3000/${teacher.otherInfo.image}`;
            }
            this.setData({ teacher });
          } else {
            wx.showToast({
              title: '获取导师详细信息失败',
              icon: 'none',
              duration: 2000
            });
          }
        },
        fail: error => {
          console.error('获取导师详细信息失败', error);
          wx.showToast({
            title: '获取导师详细信息失败',
            icon: 'none',
            duration: 2000
          });
        }
      });
    }
  });
  