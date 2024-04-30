import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { AuthServiceTokens } from 'src/auth/auth.service.token'

@Injectable()
export class UserService {
  constructor (
    private readonly prismaService: PrismaService,
  ) {}

  // create(createProjectInput: UserDetails) {
  //   const project = this.userRepository.create(createProjectInput)
  //   return this.userRepository.save(project)
  // }

  async find () {
    return this.prismaService.user.findMany()
  }

  // a commenter
  findOne (id: string) {
    return this.prismaService.user.findUnique({ where: { id } })
  }

  //   async update(id: string, updateProjectInput: UserDetails): Promise<any> {
  //     const user = await this.userRepository.findOne({ where: { id } })
  //     Object.assign(user, updateProjectInput)
  //     return await this.userRepository.save(user)
  //   }

  //  async remove(_id: string): Promise<any> {
  //     return await this.userRepository.delete(_id)
  //   }
}
