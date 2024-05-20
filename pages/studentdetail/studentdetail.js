Page({
    data: {
      student: {}
    },
    onLoad(options) {
      const studentId = options.id;
      this.getStudentDetail(studentId);
    },
    getStudentDetail(id) {
      wx.request({
        url: `http://localhost:3000/student/${id}`, // 使用你的服务器 IP 地址
        method: 'GET',
        success: res => {
          if (res.data.success) {
            const student = res.data.student;
            if (student.photo) {
              student.photo = `http://localhost:3000/${student.photo}`;
            }
            if (student.otherInfo && student.otherInfo.image) {
              student.otherInfo.image = `http://localhost:3000/${student.otherInfo.image}`;
            }
            this.setData({ student });
          } else {
            wx.showToast({
              title: '获取学生详细信息失败',
              icon: 'none',
              duration: 2000
            });
          }
        },
        fail: error => {
          console.error('获取学生详细信息失败', error);
          wx.showToast({
            title: '获取学生详细信息失败',
            icon: 'none',
            duration: 2000
          });
        }
      });
    }
  });
  