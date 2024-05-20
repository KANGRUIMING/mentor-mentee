Page({
    data: {
      students: []
    },
    onLoad() {
      this.getStudents();
    },
    getStudents() {
      wx.request({
        url: 'http://localhost:3000/students', // 使用你的服务器 IP 地址
        method: 'GET',
        success: res => {
          if (res.data.success) {
            const students = res.data.students.map(student => {
              return {
                ...student,
                photo: `http://localhost:3000/${student.photo}`
              };
            });
            this.setData({
              students: students
            });
          } else {
            wx.showToast({
              title: '获取学生信息失败',
              icon: 'none',
              duration: 2000
            });
          }
        },
        fail: error => {
          console.error('获取学生信息失败', error);
          wx.showToast({
            title: '获取学生信息失败',
            icon: 'none',
            duration: 2000
          });
        }
      });
    },
    viewStudentDetail(e) {
      const studentId = e.currentTarget.dataset.id;
      wx.navigateTo({
        url: `/pages/studentdetail/studentdetail?id=${studentId}`
      });
    }
  });
  