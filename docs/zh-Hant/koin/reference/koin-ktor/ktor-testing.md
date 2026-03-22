---
title: 測試
---

# 使用 Koin 測試 Ktor

針對使用 Koin 進行相依注入的 Ktor 應用程式，進行測試的最佳實務。

## 測試配置

### 基本測試設定

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

## 使用 Ktor testApplication 進行測試

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

## 在測試中使用隔離上下文 (Isolated Context)

每個測試都會獲得自己的隔離 Koin 執行個體：

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

### 並行測試執行

透過隔離上下文，測試可以並行執行而不會互相干擾：

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

## 模組驗證

在編譯期使用註解或在測試期驗證模組：

```kotlin
class ModuleVerificationTest : KoinTest {
    @Test
    fun `verify all modules`() {
        appModule.verify()
    }
}
```

### 包含額外型別

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

## 模擬相依性 (Mocking Dependencies)

### 使用測試模組

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

## 測試請求作用域 (Request Scopes)

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

## 使用 DI 橋接器 (Bridge) 進行測試

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

## 完整測試範例

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

## 最佳實務

1. **使用隔離上下文** — 防止測試干擾。
2. **建立測試模組** — 使用模擬物件覆寫生產環境的相依性。
3. **驗證模組** — 儘早發現配置錯誤。
4. **清理** — 使用全域上下文的測試應在結束後停止 Koin。
5. **並行安全** — 使用 `KoinIsolated` 進行並行測試執行。

## 延伸閱讀

- **[Ktor 的 Koin](/docs/reference/koin-ktor/ktor)** — Ktor 主要文件
- **[隔離上下文](/docs/reference/koin-ktor/ktor-isolated)** — 隔離的 Koin 執行個體
- **[測試](/docs/reference/koin-test/testing)** — 核心測試文件