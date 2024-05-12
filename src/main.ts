import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const userService = app.get(UserService);

  try {
    const listUser = await userService.count();
    if (listUser === 0) {
      await userService.createAdmin('admin', 'admin', 'Admin');
    }
  } catch (err) {
    console.log(err);
  }

  await app.listen(3005);
}
bootstrap();
