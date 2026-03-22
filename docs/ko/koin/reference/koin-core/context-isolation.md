---
title: 컨텍스트 격리 (Context Isolation)
---

컨텍스트 격리(Context isolation)는 SDK 개발자가 호스트 애플리케이션의 Koin 인스턴스와 충돌 없이 Koin을 사용할 수 있게 해줍니다.

:::info
일반적인 Koin 설정에 대해서는 **[Koin 시작하기 (Starting Koin)](/docs/reference/koin-core/starting-koin)**를 참고하세요.
:::

## 컨텍스트 격리를 사용하는 경우

- **SDK/라이브러리 개발** - 라이브러리 내부에서 Koin을 사용하는 경우
- **충돌 방지** - 호스트 앱 또한 Koin을 사용하고 있을 수 있는 경우
- **캡슐화** - DI 컨테이너를 비공개(private)로 유지하고 싶은 경우

## 격리된 컨텍스트 생성하기

`GlobalContext`에 등록되는 `startKoin` 대신, `koinApplication`을 사용하세요:

```kotlin
// SDK를 위한 격리된 Koin 컨텍스트
object MySdkKoinContext {

    private val koinApp = koinApplication {
        modules(sdkModule)
    }

    val koin = koinApp.koin
}

val sdkModule = module {
    single<SdkService>()
    single<SdkRepository>()
}
```

## 커스텀 KoinComponent

격리된 컨텍스트를 사용하는 커스텀 `KoinComponent`를 생성합니다:

```kotlin
internal interface SdkKoinComponent : KoinComponent {
    // 격리된 컨텍스트를 사용하도록 오버라이드
    override fun getKoin(): Koin = MySdkKoinContext.koin
}

// SDK 클래스에서의 사용 예시
class MySdkClass : SdkKoinComponent {
    private val service: SdkService by inject()  // 격리된 컨텍스트를 사용합니다.
}
```

## 격리된 컨텍스트 테스트하기

테스트에서 격리된 컨텍스트를 사용하려면 `getKoin()`을 오버라이드하세요:

```kotlin
class SdkTest : KoinTest {
    override fun getKoin(): Koin = MySdkKoinContext.koin

    @Before
    fun setUp() {
        val testModule = module {
            single<SdkService> { MockSdkService() }
        }
        koin.loadModules(listOf(testModule))
    }

    @After
    fun tearDown() {
        koin.unloadModules(listOf(testModule))
    }
}
```

## 함께 보기

- **[Koin 시작하기 (Starting Koin)](/docs/reference/koin-core/starting-koin)** - 표준 Koin 설정
- **[Compose 컨텍스트 격리 (Compose Isolated Context)](/docs/reference/koin-compose/isolated-context)** - Compose 앱에서의 격리 방식