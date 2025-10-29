---
title: Koin 내장 성능 모니터링: @Monitor
---

`@Monitor` 어노테이션(Koin Annotations 2.2.0부터 사용 가능)은 Koin의 공식 툴링 플랫폼인 [Kotzilla Platform](https://kotzilla.io)을 통해 Koin 컴포넌트에 대한 자동 성능 모니터링 및 트레이싱을 활성화합니다.

## 설정

Kotzilla SDK 의존성을 추가합니다:

```kotlin
dependencies {
    implementation "io.kotzilla:kotzilla-core:latest.version"
}
```

Kotzilla 문서에서 [최신 버전](https://doc.kotzilla.io/docs/releaseNotes/changelogSDK)을 확인하세요.

모니터링되는 클래스를 확장 가능하게 만들려면 `allOpen` 플러그인을 구성합니다:

```kotlin
plugins {
    id "org.jetbrains.kotlin.plugin.allopen"
}

allOpen {
    annotation("org.koin.core.annotation.Monitor")
}
```

Koin 설정에서 Kotzilla 애널리틱스를 초기화합니다:

```kotlin
import io.kotzilla.sdk.analytics.koin.analytics

fun initKoin() {
    startKoin {
        // Kotzilla 모니터링 활성화
        analytics()
        modules(appModule)
    }
}
```

## 기본 사용법

Koin 컴포넌트에 `@Monitor`를 간단히 추가하세요:

```kotlin
@Monitor
@Single
class UserService(private val userRepository: UserRepository) {
    fun findUser(id: String): User? = userRepository.findById(id)
    
    suspend fun createUser(userData: UserData): User {
        return userRepository.save(userData)
    }
}
```

## 생성된 코드

컴파일러는 컴포넌트를 래핑하는 프록시 클래스를 자동으로 생성합니다:

```kotlin
/**
 * @Monitor에 의해 생성됨 - 'UserService'용 Koin 프록시
 */
class UserServiceProxy(userRepository: UserRepository) : UserService(userRepository) {
    override fun findUser(id: String): User? { 
        return KotzillaCore.getDefaultInstance().trace("UserService.findUser") { 
            super.findUser(id) 
        } 
    }
    
    override suspend fun createUser(userData: UserData): User { 
        return KotzillaCore.getDefaultInstance().suspendTrace("UserService.createUser") { 
            super.createUser(userData) 
        } 
    }
}
```

Koin은 원본 클래스 대신 프록시를 자동으로 사용하여 투명하게 다음을 캡처합니다:
- 메서드 실행 시간
- 호출 빈도 및 패턴
- 오류율 및 유형
- 성능 병목 현상

## ViewModels 모니터링

ViewModels을 모니터링하여 UI 성능을 추적하세요:

```kotlin
@Monitor
@KoinViewModel
class DetailViewModel(private val repository: Repository) : ViewModel() {
    fun loadData(id: String): StateFlow<Data> = repository.getData(id)
}
```

## Kotzilla 플랫폼 통합

모니터링 데이터는 자동으로 [Kotzilla Platform](https://kotzilla.io) 워크스페이스로 전송되며, 다음을 제공합니다:

- **실시간 성능 대시보드**: 메서드 실행 시간 및 추세 확인
- **오류 추적**: 예외율 및 스택 트레이스 모니터링
- **사용량 분석**: 가장 많이 사용되는 컴포넌트 파악
- **성능 경고**: 성능 저하 발생 시 알림 수신

무료 Kotzilla 계정을 생성하고 `kotzilla.json` 파일에 API 키를 구성하세요:

```json
{
  "sdkVersion": "latest.version",
  "keys": [
    {
      "appId": "your-app-id",
      "applicationPackageName": "com.example.app",
      "keyId": "your-key-id", 
      "apiKey": "your-api-key"
    }
  ]
}
```

## 요구 사항

- `@Monitor`로 어노테이션된 클래스는 `open`이어야 합니다 (`allOpen` 플러그인에 의해 자동 처리됨)
- Kotzilla SDK 의존성은 런타임에 사용 가능해야 합니다
- 데이터 수집을 위한 유효한 Kotzilla 플랫폼 계정 및 API 키

:::info
`@Monitor` 어노테이션은 모니터링되는 클래스 자체의 메서드 호출만 추적합니다. 모니터링되는 클래스에 주입된 의존성은 해당 의존성도 `@Monitor`로 어노테이션되지 않는 한 자동으로 모니터링되지 않습니다.
:::

:::note
전체 설정 지침 및 고급 구성 옵션은 [Kotzilla 문서](https://doc.kotzilla.io)를 참조하십시오.
:::