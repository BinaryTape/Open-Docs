---
title: 测试
---

# 使用 Koin 测试 Ktor

测试使用 Koin 进行依赖注入的 Ktor 应用程序的最佳实践。

## 测试配置

### 基础测试设置

```kotlin
class UserServiceTest : KoinTest {

    @get:Rule
    val koinTestRule = KoinTestRule.create {
        modules(testModule)
    }

    private val userService: UserService by inject()

    @Test
    fun `should return user`() {
        val user = userService.getUser("123")
        assertNotNull(user)
    }
}

val testModule = module {
    single<UserRepository> { MockUserRepository() }
    singleOf(::UserService)
}
```

## 使用 Ktor testApplication 进行测试

```kotlin
class ApplicationTest {
    @Test
    fun `test hello endpoint`() = testApplication {
        application {
            install(Koin) {
                modules(testModule)
            }
            configureRouting()
        }

        client.get("/hello?name=Test").apply {
            assertEquals(HttpStatusCode.OK, status)
            assertContains(bodyAsText(), "Test")
        }
    }
}
```

## 为测试使用隔离上下文

每个测试都会获得其自己的隔离 Koin 实例：

```kotlin
class UserRoutesTest {
    @Test
    fun `test user endpoint`() = testApplication {
        application {
            install(KoinIsolated) {
                modules(testModule)
            }
            configureRouting()
        }

        client.get("/users/123").apply {
            assertEquals(HttpStatusCode.OK, status)
        }
    }
}
```

### 并行测试执行

使用隔离上下文，测试可以并行运行而不会相互干扰：

```kotlin
class ParallelTests {
    @Test
    fun `test A`() = testApplication {
        application {
            install(KoinIsolated) {
                modules(moduleA)
            }
        }
        // ...
    }

    @Test
    fun `test B`() = testApplication {
        application {
            install(KoinIsolated) {
                modules(moduleB)
            }
        }
        // ...
    }
}
```

## 模块验证

在编译时使用注解或在测试时验证模块：

```kotlin
class ModuleVerificationTest : KoinTest {
    @Test
    fun `verify all modules`() {
        appModule.verify()
    }
}
```

### 使用额外类型

```kotlin
@Test
fun `verify modules with extra types`() {
    appModule.verify(
        extraTypes = listOf(
            ApplicationCall::class,
            Application::class
        )
    )
}
```

## 模拟依赖项

### 使用测试模块

```kotlin
val productionModule = module {
    singleOf(::UserRepositoryImpl) bind UserRepository::class
    singleOf(::UserService)
}

val testModule = module {
    single<UserRepository> { MockUserRepository() }
    singleOf(::UserService)
}
```

### 使用 Mockk

```kotlin
class UserServiceTest : KoinTest {
    private val mockRepository = mockk<UserRepository>()

    @get:Rule
    val koinTestRule = KoinTestRule.create {
        modules(module {
            single { mockRepository }
            singleOf(::UserService)
        })
    }

    @Test
    fun `should call repository`() {
        val userService: UserService by inject()

        every { mockRepository.findById("123") } returns User("123", "Test")

        val user = userService.getUser("123")

        verify { mockRepository.findById("123") }
        assertEquals("Test", user?.name)
    }
}
```

## 测试请求作用域

```kotlin
class RequestScopeTest {
    @Test
    fun `test request scoped component`() = testApplication {
        application {
            install(Koin) {
                modules(module {
                    singleOf(::UserService)
                    requestScope {
                        scopedOf(::RequestLogger)
                    }
                })
            }

            routing {
                get("/test") {
                    val logger = call.scope.get<RequestLogger>()
                    logger.log("Test message")
                    call.respondText("OK")
                }
            }
        }

        client.get("/test").apply {
            assertEquals(HttpStatusCode.OK, status)
        }
    }
}
```

## 使用 DI 桥接进行测试

```kotlin
class BridgeTest {
    @Test
    fun `test with bridge`() = testApplication {
        application {
            dependencies {
                provide<Database> { MockDatabase() }
            }

            install(Koin) {
                bridge {
                    koinToKtor()
                }
                modules(appModule)
            }

            configureRouting()
        }

        client.get("/users").apply {
            assertEquals(HttpStatusCode.OK, status)
        }
    }
}
```

## 完整测试示例

```kotlin
class UserApiTest : KoinTest {

    @Test
    fun `should return all users`() = testApplication {
        application {
            install(KoinIsolated) {
                modules(testModule)
            }

            routing {
                val userService by inject<UserService>()

                get("/api/users") {
                    call.respond(userService.getAllUsers())
                }
            }
        }

        client.get("/api/users").apply {
            assertEquals(HttpStatusCode.OK, status)
            val users = Json.decodeFromString<List<User>>(bodyAsText())
            assertEquals(2, users.size)
        }
    }

    @Test
    fun `should return user by id`() = testApplication {
        application {
            install(KoinIsolated) {
                modules(testModule)
            }

            routing {
                val userService by inject<UserService>()

                get("/api/users/{id}") {
                    val id = call.parameters["id"]!!
                    val user = userService.getUser(id)
                        ?: return@get call.respond(HttpStatusCode.NotFound)
                    call.respond(user)
                }
            }
        }

        client.get("/api/users/1").apply {
            assertEquals(HttpStatusCode.OK, status)
        }

        client.get("/api/users/999").apply {
            assertEquals(HttpStatusCode.NotFound, status)
        }
    }
}

val testModule = module {
    single<UserRepository> {
        MockUserRepository(
            listOf(
                User("1", "Alice", "alice@example.com"),
                User("2", "Bob", "bob@example.com")
            )
        )
    }
    singleOf(::UserService)
}
```

## 最佳实践

1. **使用隔离上下文** - 防止测试干扰。
2. **创建测试模块** - 使用模拟对象覆盖生产依赖项。
3. **验证模块** - 尽早捕获配置错误。
4. **清理** - 使用全局上下文的测试应在之后停止 Koin。
5. **并行安全** - 使用 `KoinIsolated` 进行并行测试执行。

## 另请参阅

- **[Ktor 版 Koin](/docs/reference/koin-ktor/ktor)** - Ktor 主文档
- **[隔离上下文](/docs/reference/koin-ktor/ktor-isolated)** - 隔离的 Koin 实例
- **[测试](/docs/reference/koin-test/testing)** - 核心测试文档