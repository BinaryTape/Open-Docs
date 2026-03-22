---
title: テスト
---

# Koin を使用した Ktor のテスト

依存関係注入に Koin を使用する Ktor アプリケーションをテストするためのベストプラクティスを紹介します。

## テスト設定

### 基本的なテストのセットアップ

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

## Ktor の testApplication を使用したテスト

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

## テストでの Isolated Context の使用

各テストは、それぞれ独自の分離された Koin インスタンス（Isolated Context）を取得します。

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

### テストの並列実行

Isolated Context を使用すると、テストは互いに干渉することなく並列で実行できます。

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

## モジュールの検証

アノテーションを使用してコンパイル時に、またはテスト時にモジュールを検証します。

```kotlin
class ModuleVerificationTest : KoinTest {
    @Test
    fun `verify all modules`() {
        appModule.verify()
    }
}
```

### 追加の型を使用する場合

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

## 依存関係のモック

### テスト用モジュールの使用

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

### Mockk の使用

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

## リクエストスコープのテスト

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

## DI Bridge を使用したテスト

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

## 完全なテスト例

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

## ベストプラクティス

1. **Isolated Context を使用する** - テスト間の干渉を防ぎます。
2. **テスト用モジュールを作成する** - 本番環境の依存関係をモックでオーバーライドします。
3. **モジュールを検証する** - 設定エラーを早期に発見します。
4. **クリーンアップを行う** - グローバルコンテキストを使用するテストは、終了後に Koin を停止させる必要があります。
5. **並列実行の安全性** - 並列テスト実行には `KoinIsolated` を使用します。

## 関連項目

- **[Koin for Ktor](/docs/reference/koin-ktor/ktor)** - 主要な Ktor ドキュメント
- **[Isolated Context](/docs/reference/koin-ktor/ktor-isolated)** - 分離された Koin インスタンス
- **[Testing](/docs/reference/koin-test/testing)** - コアテストドキュメント