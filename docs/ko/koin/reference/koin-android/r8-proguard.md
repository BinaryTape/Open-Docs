---
title: R8 / ProGuard
---

이 페이지는 코드 축소 및 난독화(R8 / ProGuard) 환경에서 Koin이 어떻게 동작하는지, Koin이 무엇을 자동으로 유지해 주는지, 그리고 **사용자**가 앱에서 직접 유지해야 하는 항목이 무엇인지 설명합니다.

## TL;DR

- **Koin의 핵심 해결(resolution) 방식은 R8에 안전합니다.** `get<T>()`, `inject<T>()` 및 `*Of` 빌더(`singleOf`, `factoryOf`, `viewModelOf` 등)는 **컴파일 타임**에 종속성을 해결합니다. 이들은 실체화된 타입(reified types)을 사용하며, Android/JVM에서는 `Class.getName()`을 통해 레지스트리 키를 생성합니다. **생성자에 대한 런타임 리플렉션(runtime reflection)이 발생하지 않으므로**, Koin을 위해 정의부(definitions), ViewModel 또는 그 생성자들을 유지(keep)할 필요가 없습니다.
- Koin은 Android AAR(`koin-android`, `koin-core-viewmodel`, `koin-compose-viewmodel`, `koin-androidx-workmanager`, `koin-androidx-startup`) 내에 `consumer-rules.pro`를 포함하고 있으므로, 아래 규칙들이 자동으로 적용됩니다. 보통 사용자가 별도로 추가할 내용은 없습니다.
- 하지만 **다른 요소**에 의해 리플렉션으로 로드되는 클래스들은 여전히 유지해야 합니다(아래 참고).

## Koin이 자동으로 유지하는 항목 (포함된 컨슈머 규칙)

AAR은 Koin 내부 로직에 대한 R8 경고를 무시하도록 설정합니다:

```proguard
-dontwarn org.koin.**
```

`koin-androidx-startup`은 매니페스트에 참조된 초기화 도구(initializer)를 추가로 유지합니다. 이 규칙들 중 어느 것도 애플리케이션 클래스를 직접 유지하지 않으며, Koin은 이를 유지할 필요가 없습니다.

## 직접 유지해야 하는 항목

이 항목들은 Koin의 해결 방식이 아니라 플랫폼이나 라이브러리에서 기인합니다:

- **`KoinFragmentFactory`로 생성된 Fragment**는 클래스 이름을 통해 인스턴스화됩니다. Fragment 하위 클래스들을 유지하십시오(일반적으로 `@Keep`, 레이아웃 참조 또는 AndroidX 규칙을 통해 이미 유지되고 있습니다).
- **WorkManager `ListenableWorker` 하위 클래스들**은 `androidx.work` 자체의 컨슈머 규칙에 의해 유지됩니다.
- **프로세스 종료를 위한 저장된 상태(Saved state).** `SavedStateHandle`은 Koin이 아니라 AndroidX `CreationExtras`에 의해 제공됩니다. 여기에 넣는 값들은 다른 저장된 상태와 마찬가지로 R8에서 살아남아야 합니다. 직접 정의한 `@Parcelize` / `Serializable` 상태 클래스들을 유지하십시오:

```proguard
# 예시 — 직접 정의한 saved-state 페이로드 유지
-keep class com.example.** implements android.os.Parcelable { *; }
```

## ViewModels & SavedStateHandle (#2044)

간헐적으로 발생하는 `No definition found for SavedStateHandle` 크래시가 R8이 Koin의 ViewModel 리플렉션을 제거하기 때문이라는 오해가 많습니다. **그렇지 않습니다.** `viewModelOf(::MyViewModel)`은 컴파일 타임에 결정되므로, ViewModel에 `-keep`을 설정해도 Koin의 해결 방식에는 영향을 주지 않습니다.

`SavedStateHandle`은 **ViewModel이 생성되는 동안**에만 사용 가능합니다(팩토리에 전달된 `CreationExtras`로부터 빌드됩니다). 이를 **ViewModel 생성자에서 직접** 해결하십시오. 지연 로딩(lazy)이나 생성 후에 해결하려고 하지 마십시오:

```kotlin
// ✅ 생성 중에 해결됨
class MyViewModel(val handle: SavedStateHandle) : ViewModel()

// ❌ 나중에 해결됨 — 이때는 CreationExtras가 사라진 상태임
class MyViewModel(koin: Koin) : ViewModel() {
    val handle by lazy { koin.get<SavedStateHandle>() } // 실패
}
```

`viewModelScope { }` 내부에서 ViewModel을 선언하는 경우, 스코프가 생성될 수 있도록 일치하는 옵션을 활성화하십시오:

```kotlin
startKoin {
    options(viewModelScopeFactory())
    modules(appModule)
}
```

## Android 이외의 타겟 (JS / WASM / Native)

Android/JVM에서 Koin은 R8 환경에서도 안정적인 `Class.getName()`으로 레지스트리 키를 생성합니다. **Kotlin/JS, WASM, Native**에서 Koin은 Kotlin 리플렉션의 `qualifiedName` / `simpleName`을 사용합니다. 이러한 타겟에서 공격적인 이름 축소(minification)는 타입 식별에 영향을 줄 수 있습니다. Android 이외의 타겟에서 축소를 적용할 때는 클래스 이름에 의존하기보다는 **이름이 지정된 한정자(named qualifiers)**(`named("...")`)를 사용하는 것을 권장합니다.