---
title: 테스트
---

# Koin을 사용한 Ktor 테스트하기

의존성 주입(Dependency Injection)을 위해 Koin을 사용하는 Ktor 애플리케이션을 테스트할 때의 모범 사례입니다.

## 테스트 설정

### 기본 테스트 설정

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

## Ktor testApplication으로 테스트하기

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

## 테스트를 위한 격리된 컨텍스트(Isolated Context) 사용

각 테스트는 고유의 격리된 Koin 인스턴스를 갖습니다.

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

### 병렬 테스트 실행

격리된 컨텍스트를 사용하면 테스트가 서로 간섭 없이 병렬로 실행될 수 있습니다.

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

## 모듈 검증

애노테이션을 사용하여 컴파일 타임에 모듈을 검증하거나 테스트 타임에 검증할 수 있습니다.

```kotlin
class ModuleVerificationTest : KoinTest {
    @Test
    fun `verify all modules`() {
        appModule.verify()
    }
}
```

### 추가 타입과 함께 사용

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

## 의존성 모킹 (Mocking Dependencies)

### 테스트 모듈 사용

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

### Mockk 사용

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

## 리퀘스트 스코프 (Request Scopes) 테스트

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

## DI 브리지 (Bridge)로 테스트하기

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

## 전체 테스트 예시

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

## 모범 사례

1. **격리된 컨텍스트(Isolated context) 사용** - 테스트 간의 간섭을 방지합니다.
2. **테스트 모듈 생성** - 프로덕션 의존성을 모크(mock)로 오버라이드합니다.
3. **모듈 검증** - 구성 오류를 조기에 발견합니다.
4. **정리(Clean up)** - 글로벌 컨텍스트를 사용하는 테스트는 완료 후 Koin을 중지해야 합니다.
5. **병렬 안전성** - 병렬 테스트 실행을 위해 `KoinIsolated`를 사용합니다.

## 참고 항목

- **[Ktor용 Koin](/docs/reference/koin-ktor/ktor)** - 메인 Ktor 문서
- **[격리된 컨텍스트](/docs/reference/koin-ktor/ktor-isolated)** - 격리된 Koin 인스턴스
- **[테스트](/docs/reference/koin-test/testing)** - 핵심 테스트 문서