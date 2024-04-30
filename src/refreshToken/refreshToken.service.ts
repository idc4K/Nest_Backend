// import { Injectable } from '@nestjs/common'
// import { InjectRepository } from '@nestjs/typeorm'
// import { Repository } from 'typeorm'
// import { RefreshToken } from './refreshToken.entity'

// @Injectable()
// export class RefreshTokenService {
//   constructor (
//     @InjectRepository(RefreshToken) private refreshTokenRepository: Repository<RefreshToken>
//   ) {}

//   // create(createProjectInput: RefreshToken) {
//   //   const project = this.refreshTokenRepository.create(createProjectInput)
//   //   return this.refreshTokenRepository.save(project)
//   // }

//   findAll (): Promise<RefreshToken[]> {
//     return this.refreshTokenRepository.find()
//     // return this.refreshTokenRepository.find({
//     //   relations:["employees","employees.categories"]
//     // })
//   }

//   //   findOne(id: string): Promise<RefreshToken> {
//   //     return this.refreshTokenRepository.findOne({ where: { id }})
//   //   }

//   //   async update(id: string, updateProjectInput: RefreshToken): Promise<any> {
//   //     const refreshToken = await this.refreshTokenRepository.findOne({ where: { id } })
//   //     Object.assign(refreshToken, updateProjectInput)
//   //     return await this.refreshTokenRepository.save(refreshToken)
//   //   }

// //  async remove(_id: string): Promise<any> {
// //     return await this.refreshTokenRepository.delete(_id)
// //   }
// }
