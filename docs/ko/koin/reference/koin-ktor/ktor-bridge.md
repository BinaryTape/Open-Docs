---
title: DI 브리지
---

# Ktor DI 브리지

Koin 4.2+는 구성 가능한 브리지를 통해 **Ktor 3.4+**의 내장 의존성 주입(dependency injection) 시스템과의 원활한 통합을 제공합니다.

:::info 실험적 기능
Ktor DI 브리지는 Koin과 Ktor DI 간의 양방향 의존성 해결(dependency resolution)을 가능하게 하는 실험적 기능입니다.
:::

## 브리지 구성

`bridge { }` DSL을 사용하여 양방향 의존성 해결을 활성화합니다:

```kotlin
fun Application.module() {
    install(Koin) {
        slf4jLogger()

        bridge {
            ktorToKoin()  // Ktor DI가 Koin 의존성을 해결할 수 있음
            koinToKtor()  // Koin이 Ktor DI 의존성을 해결할 수 있음
        }

        modules(appModule)
    }

    // Ktor DI 의존성
    dependencies {
        provide<KtorSpecificService> { KtorSpecificServiceImpl() }
    }
}
```

## 브리지 옵션

| 옵션 | 설명 |
|--------|-------------|
| `ktorToKoin()` | Ktor의 `by dependencies` 위임(delegate)이 Koin에서 의존성을 해결할 수 있도록 허용합니다. |
| `koinToKtor()` | Koin의 `inject()` 및 `get()`이 Ktor DI에서 의존성을 해결할 수 있도록 허용합니다. |

## ktorToKoin() 사용하기

Ktor의 `by dependencies` 위임을 사용하여 Koin 의존성을 해결합니다:

```kotlin
fun Application.module() {
    install(Koin) {
        bridge {
            ktorToKoin()
        }
        modules(module {
            single<HelloService> { HelloServiceImpl() }
        })
    }

    routing {
        get("/hello") {
            // Ktor 위임을 사용하여 Koin 의존성 해결
            val helloService: HelloService by dependencies
            call.respondText(helloService.sayHello())
        }
    }
}
```

## koinToKtor() 사용하기

Koin의 `inject()`를 사용하여 Ktor DI 의존성을 해결합니다:

```kotlin
fun Application.module() {
    install(Koin) {
        bridge {
            koinToKtor()
        }
        modules(appModule)
    }

    // Ktor DI에서 선언
    dependencies {
        provide<DatabaseConnection> { DatabaseConnectionImpl() }
    }

    routing {
        get("/data") {
            // Koin을 사용하여 Ktor DI 의존성 해결
            val database: DatabaseConnection by inject()
            call.respondText(database.query())
        }
    }
}
```

## 전체 양방향 예제

최대한의 유연성을 위해 양방향을 모두 활성화합니다:

```kotlin
fun Application.module() {
    install(Koin) {
        slf4jLogger()

        bridge {
            ktorToKoin()
            koinToKtor()
        }

        modules(module {
            single<HelloService> { HelloServiceImpl() }
        })
    }

    dependencies {
        provide<KtorSpecificService> { KtorSpecificServiceImpl() }
    }

    routing {
        // 둘 다 Koin의 inject() 사용
        get("/mixed-koin") {
            val helloService: HelloService by inject()        // Koin에서 가져옴
            val ktorService: KtorSpecificService by inject()  // Ktor DI에서 가져옴
            call.respondText("${helloService.sayHello()} - ${ktorService.process()}")
        }

        // 둘 다 Ktor의 dependencies 위임 사용
        get("/mixed-ktor") {
            val helloService: HelloService by dependencies        // Koin에서 가져옴
            val ktorService: KtorSpecificService by dependencies  // Ktor DI에서 가져옴
            call.respondText("${helloService.sayHello()} - ${ktorService.process()}")
        }
    }
}
```

## 아키텍처 패턴

인프라와 애플리케이션 로직을 분리합니다:

- **Ktor DI** - 프레임워크 수준의 의존성 (데이터베이스, 구성, 인프라)
- **Koin** - 애플리케이션 수준의 의존성 (리포지토리, 서비스, 유스케이스)

```kotlin
fun Application.module() {
    // Ktor DI - 인프라 계층
    val config = environment.config
    val database = Database(config)
    dependencies {
        provide<Database> { database }
        provide<ApplicationConfig> { config }
    }

    // Koin - 애플리케이션 계층
    install(Koin) {
        slf4jLogger()

        bridge {
            koinToKtor()  // Koin이 인프라 의존성을 해결할 수 있음
        }

        modules(appModule)
    }
}

val appModule = module {
    // 이것들은 브리지를 통해 Ktor DI에서 Database를 주입받을 수 있음
    singleOf(::CustomerRepository)
    singleOf(::OrderRepository)
    singleOf(::CustomerService)
}
```

## 권장 사항

1. **Ktor DI에 인프라 배치** - 데이터베이스 연결, 구성, 외부 클라이언트
2. **Koin에 비즈니스 로직 배치** - 리포지토리, 서비스, 유스케이스
3. **필요한 방향만 활성화** - 꼭 필요한 경우가 아니라면 양쪽 모두가 아닌 `koinToKtor()`만 사용
4. **경계 문서화** - 어떤 시스템이 어떤 의존성을 소유하는지 명확히 함

## 격리된 컨텍스트와 함께 사용

브리지는 `KoinIsolated`와도 함께 작동합니다:

```kotlin
fun Application.module() {
    dependencies {
        provide<Database> { Database(environment.config) }
    }

    install(KoinIsolated) {
        slf4jLogger()

        bridge {
            koinToKtor()
        }

        modules(appModule)
    }
}
```

## 참고 항목

- **[Ktor용 Koin](/docs/reference/koin-ktor/ktor)** - 기본 Ktor 문서
- **[격리된 컨텍스트](/docs/reference/koin-ktor/ktor-isolated)** - 격리된 Koin 인스턴스