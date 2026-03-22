---
title: ViewModel
---

Koin은 `koin-core-viewmodel` 모듈을 통해 멀티플랫폼 ViewModel 지원을 제공합니다. 이를 통해 모든 Kotlin Multiplatform 타겟에서 [AndroidX ViewModel](https://developer.android.com/topic/libraries/architecture/viewmodel) 인스턴스를 선언하고 주입할 수 있습니다.

## 설정 (Setup)

핵심 ViewModel 의존성을 추가하세요:

```kotlin
// build.gradle.kts (commonMain)
implementation("io.insert-koin:koin-core-viewmodel:$koin_version")
```

플랫폼별 주입 API를 사용하려면 다음을 추가하세요:

```kotlin
// Android
implementation("io.insert-koin:koin-android:$koin_version")

// Compose Multiplatform
implementation("io.insert-koin:koin-compose-viewmodel:$koin_version")
```

## ViewModel 선언하기

### 컴파일러 플러그인 DSL (Compiler Plugin DSL)

```kotlin
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()

val appModule = module {
    viewModel<UserViewModel>()
}
```

### 어노테이션 (Annotations)

```kotlin
@KoinViewModel
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()
```

### 클래식 DSL (Classic DSL)

```kotlin
val appModule = module {
    // 생성자 참조 사용
    viewModelOf(::UserViewModel)

    // 람다 사용
    viewModel { UserViewModel(get()) }
}
```

## 파라미터가 있는 ViewModel

`@InjectedParam`을 사용하여 주입 시점에 파라미터를 전달하세요:

### 컴파일러 플러그인 DSL (Compiler Plugin DSL)

```kotlin
class DetailViewModel(
    @InjectedParam val itemId: String,
    private val repository: DetailRepository
) : ViewModel()

val appModule = module {
    viewModel<DetailViewModel>()
}
```

### 어노테이션 (Annotations)

```kotlin
@KoinViewModel
class DetailViewModel(
    @InjectedParam val itemId: String,
    private val repository: DetailRepository
) : ViewModel()
```

### 클래식 DSL (Classic DSL)

```kotlin
val appModule = module {
    viewModel { params ->
        DetailViewModel(
            itemId = params.get(),
            repository = get()
        )
    }
}
```

## ViewModel 스코프 (ViewModel Scope)

자신만의 스코프 의존성이 필요한 ViewModel은 `viewModelScope` 아키타입(archetype)을 사용합니다. `viewModelScope` 내부에 선언된 의존성은 ViewModel의 생명주기(lifecycle)에 묶입니다.

### 컴파일러 플러그인 DSL (Compiler Plugin DSL)

```kotlin
val appModule = module {
    viewModelScope {
        scoped<UserCache>()
        scoped<UserRepository>()
        viewModel<UserViewModel>()
    }
}
```

### 어노테이션 (Annotations)

```kotlin
@ViewModelScope
class UserCache

@ViewModelScope
class UserRepository(private val cache: UserCache)

@KoinViewModel
@ViewModelScope
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()
```

### 클래식 DSL (Classic DSL)

```kotlin
val appModule = module {
    viewModelScope {
        scoped { UserCache() }
        scoped { UserRepository(get()) }
        viewModel { UserViewModel(get()) }
    }
}
```

:::info
`viewModelScope` 내부의 의존성은 ViewModel에 처음 접근할 때 생성되고, ViewModel이 클리어(cleared)될 때 소멸됩니다.
:::

## ViewModel 주입하기

### Compose (멀티플랫폼)에서

Composable 함수에서 `koinViewModel()`을 사용하세요:

```kotlin
@Composable
fun UserScreen() {
    val viewModel = koinViewModel<UserViewModel>()
    // 또는 파라미터와 함께 사용
    val detailVM = koinViewModel<DetailViewModel> { parametersOf("item_123") }
}
```

### Android에서

Activity 또는 Fragment에서 `by viewModel()` 델리게이트를 사용하세요:

```kotlin
class UserActivity : AppCompatActivity() {
    private val viewModel: UserViewModel by viewModel()

    // 파라미터와 함께 사용
    private val detailVM: DetailViewModel by viewModel { parametersOf("item_123") }
}
```

## SavedStateHandle

ViewModel 생성자에 `SavedStateHandle`을 추가하면 Koin이 이를 자동으로 주입합니다:

```kotlin
@KoinViewModel
class MyViewModel(
    private val handle: SavedStateHandle,
    private val repository: UserRepository
) : ViewModel() {

    val userId: String? = handle["userId"]
}
```

```kotlin
val appModule = module {
    viewModel<MyViewModel>()  // 컴파일러 플러그인 DSL
    // 또는
    viewModelOf(::MyViewModel)  // 클래식 DSL
}
```

## 빠른 참조 (Quick Reference)

| 방식 | 모듈 선언 | 스코프 선언 |
|----------|-------------------|-------------------|
| 컴파일러 플러그인 DSL | `viewModel<MyVM>()` | `viewModelScope { viewModel<MyVM>() }` |
| 어노테이션 | `@KoinViewModel` | `@KoinViewModel @ViewModelScope` |
| 클래식 DSL | `viewModelOf(::MyVM)` | `viewModelScope { viewModelOf(::MyVM) }` |

| 플랫폼 | 주입 API |
|----------|---------------|
| Compose | `koinViewModel<MyVM>()` |
| Android | `by viewModel()` |

## 플랫폼별 기능

- **Android**: Activity/Fragment 공유, Navigation Graph 스코핑 등에 대해서는 [Android ViewModel](/docs/reference/koin-android/viewmodel)을 참조하세요.
- **Compose**: Compose 전용 API에 대해서는 [Compose ViewModel](/docs/reference/koin-compose/compose#viewmodel-for-composable)을 참조하세요.

## 다음 단계

- **[스코프 (Scopes)](/docs/reference/koin-core/scopes)** - 핵심 스코프 개념
- **[Android ViewModel](/docs/reference/koin-android/viewmodel)** - Android 전용 기능
- **[Compose](/docs/reference/koin-compose/compose)** - Compose 멀티플랫폼 통합