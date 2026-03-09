import { UserRepository } from "../../domain/repositories/UserRepository";
import { UserStatsResponseDto } from "../dto/GetUserStatsDto";
import { ListUsersDto } from "../dto/ListUsersDto";

export class ListUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(dto: ListUsersDto) {
    return this.userRepository.findAll(
      dto.search, 
      dto.page, 
      dto.limit);
  }
}
