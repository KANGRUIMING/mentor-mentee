Page({
    data: {
      teachers: []
    },
    onLoad() {
      this.getTeachers();
    },
    getTeachers() {
      wx.request({
        url: 'http://localhost:3000/teachers', // 使用你的服务器 IP 地址
        method: 'GET',
        success: res => {
          if (res.data.success) {
            const teachers = res.data.teachers.map(teacher => {
              return {
                ...teacher,
                photo: `http://localhost:3000/${teacher.photo}`
              };
            });
            this.setData({
              teachers
            });
          } else {
            wx.showToast({
              title: '获取导师信息失败',
              icon: 'none',
              duration: 2000
            });
          }
        },
        fail: error => {
          console.error('获取导师信息失败', error);
          wx.showToast({
            title: '获取导师信息失败',
            icon: 'none',
            duration: 2000
          });
        }
      });
    },
    viewTeacherDetail(e) {
      const teacherId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/teacherdetail/teacherdetail?id=${teacherId}`
      });
    },
    editInfo() {
      wx.navigateTo({
        url: '/pages/teacher/editinfo/editinfo'
      });
    }
  });
  