import bcrypt from 'bcryptjs';
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
      try {
          var hashPassword = await bcrypt.hashSync(password, salt);
          resolve(hashPassword)
      } catch (e) {
          reject(e)
      }
  })
}

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};

      let isExist = await checkUserEmail(email);
      if (isExist) {
        //user already exist

        let user = await db.User.findOne({
          where: { email },
          attributes: ['id','email', 'roleId', 'password', 'firstName', 'lastName'],
          raw: true,
        });
        if (user) {
          //compare password
          let check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = 'OK';

            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = 'Nhập sai mật khẩu';
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = 'Tài khoản không tồn tại';
        }
      } else {
        //return error
        userData.errCode = 1;
        userData.errMessage =
          "Tài khoản này không tồn tại, hãy yêu cầu đăng ký";
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = (userEmail) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: userEmail },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let users = '';
        if (userId === 'ALL') {
          users = await db.User.findAll({
            attributes: {
              exclude: ['password'],
            },
            include: [
              {
                model: db.Allcode,
                as: 'roleData',
                attributes: ['valueEn', 'valueVi'],
              }
            ],
            raw: true
          });
        }
        if (userId && userId !== 'ALL') {
          users = await db.User.findOne({
            where: { id: userId },
            attributes: {
              exclude: ['password'],
            },
            include: [
              {
                model: db.Allcode,
                as: 'roleData',
                attributes: ['valueEn', 'valueVi'],
              }
            ],
            raw: true
          });
        }
        resolve(users);
      } catch (e) {
        reject(e);
      }
    });
};

let createNewUser = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      //Check email is exist??
      let check = await checkUserEmail(data.email);
      if (check === true) {
        resolve({
          errCode: 1,
          errMessage: 'Your email is already in used, Please try another email!',
        });
      } else {
          let hashPasswordFromBcrypt = await hashUserPassword(data.password);
          await db.User.create({
          email: data.email,
          password: hashPasswordFromBcrypt,
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
          phoneNumber: data.phoneNumber,
          gender: data.gender,
          roleId: data.roleId,
          positionId: data.positionId,
          image: data.avatar,
        });
        resolve({
          errCode: 0,
          message: 'OK',
        });
      }
      
    } catch (e) {
      reject(e);
    }
  });
};

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
      });
      let userDoctor = await db.Doctor_Infor.findOne({
        where: { doctorId: userId },
      })
      if (!user) {
        resolve({
          errCode: 2,
          errMessage: 'The user is not exist!',
        });
      }
      await db.User.destroy({
        where: { id: userId },
      });
      if(userDoctor) {
        await db.Doctor_Infor.destroy({
          where: { doctorId: userId },
        });
      }
      resolve({
        errCode: 0,
        message: 'The user is deleted!',
      });
    } catch (e) {
      reject(e);
    }
  });
};

let updateUserData = (data) => {    
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id || !data.roleId || !data.positionId || !data.gender) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameter!',
        });
      }
      let user = await db.User.findOne({
        where: { id: data.id },
        raw: false,
      });
      if (user) {
        user.id = data.id;
        user.firstName = data.firstName,
        user.lastName = data.lastName,
        user.address = data.address;
        user.roleId = data.roleId;
        user.gender = data.gender;
        user.positionId = data.positionId;
        user.phoneNumber = data.phoneNumber
        // user.image = data.image
        if (data.image) {
          user.image = data.image
        }
        await user.save();
        resolve({
          errCode: 0,
          message: 'Update user data successfully!',
        });
      } else {
        resolve({
          errCode: 2,
          errMessage: 'The user is not exist!',
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};  

let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      if(!typeInput) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameters!',
        });
      } else {
        let res = {};
        let allcode = await db.Allcode.findAll({
          where: {type : typeInput}
        });
        res.errCode = 0
        res.data = allcode
        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  })
}

let getFilterUser = (role) => {
  return new Promise(async(resolve, reject) => {
    try{
      if(!role) {
        resolve({
          errCode: 1,
          errMessage: 'Missing required parameter'
        })
      } else {
            let roleUser = []
            if(role === 'ALL'){
              roleUser = await db.User.findAll({
                attributes: {
                  exclude: ['password', 'image'],
                },
                include: [
                  {
                    model: db.Allcode,
                    as: 'roleData',
                    attributes: ['valueEn', 'valueVi'],
                  }
                ],
                raw: true
              }) 
            } else{
              // find user by role
              roleUser = await db.User.findAll({
                where: {
                  roleId: role
                },
                attributes: {
                  exclude: ['password', 'image'],
                },
                include: [
                  {
                    model: db.Allcode,
                    as: 'roleData',
                    attributes: ['valueEn', 'valueVi'],
                  }
                ],
                raw: true
              }) 
            }
          // roleUser.reverse();
          resolve({
            errCode: 0,
            errMessage: 'OK',
            roleUser
          })
      }
    } catch(e) {
      reject(e)
    }
  })
}

module.exports = { 
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService,
    checkUserEmail: checkUserEmail,
    getFilterUser: getFilterUser
};