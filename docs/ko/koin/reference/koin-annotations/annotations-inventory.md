# Koin 어노테이션 목록

이 문서는 모든 Koin 어노테이션, 해당 파라미터, 동작 및 사용 예시에 대한 포괄적인 목록을 제공합니다.

## 목차

- [정의 어노테이션](#definition-annotations)
  - [@Single](#single)
  - [@Factory](#factory)
  - [@Scoped](#scoped)
- [스코프 어노테이션](#scope-annotations)
  - [@Scope](#scope)
  - [@ViewModelScope](#viewmodelscope)
  - [@ActivityScope](#activityscope)
  - [@ActivityRetainedScope](#activityretainedscope)
  - [@FragmentScope](#fragmentscope)
  - [@ScopeId](#scopeid)
- [ViewModel 및 Android 관련 어노테이션](#viewmodel--android-specific-annotations)
  - [@KoinViewModel](#koinviewmodel)
  - [@KoinWorker](#koinworker)
- [한정자 어노테이션](#qualifier-annotations)
  - [@Named](#named)
  - [@Qualifier](#qualifier)
- [속성 어노테이션](#property-annotations)
  - [@Property](#property)
  - [@PropertyValue](#propertyvalue)
- [모듈 및 애플리케이션 어노테이션](#module--application-annotations)
  - [@Module](#module)
  - [@ComponentScan](#componentscan)
  - [@Configuration](#configuration)
  - [@KoinApplication](#koinapplication)
- [모니터링 어노테이션](#monitoring-annotations)
  - [@Monitor](#monitor)
- [메타 어노테이션 (내부용)](#meta-annotations-internal)
  - [@ExternalDefinition](#externaldefinition)
  - [@MetaDefinition](#metadefinition)
  - [@MetaModule](#metamodule)
  - [@MetaApplication](#metaapplication)

---

## 정의 어노테이션

### @Single

**패키지:** `org.koin.core.annotation`

**대상:** `CLASS`, `FUNCTION`

**설명:** 타입 또는 함수를 Koin의 `single` (싱글턴) 정의로 선언합니다. 단일 인스턴스가 생성되어 애플리케이션 전체에서 공유됩니다.

**파라미터:**
- `binds: Array<KClass<*>> = [Unit::class]` - 이 정의에 바인딩할 명시적 타입입니다. 상위 타입은 자동으로 감지됩니다.
- `createdAtStart: Boolean = false` - `true`인 경우, Koin이 시작될 때 인스턴스가 생성됩니다.

**동작:**
모든 종속성은 생성자 주입으로 채워집니다.

**예시:**
```kotlin
@Single
class MyClass(val d : MyDependency)
```

**생성된 Koin DSL:**
```kotlin
single { MyClass(get()) }
```

**명시적 바인딩:**
```kotlin
@Single(binds = [MyInterface::class])
class MyClass(val d : MyDependency) : MyInterface
```

**시작 시 생성:**
```kotlin
@Single(createdAtStart = true)
class MyClass(val d : MyDependency)
```

---

### @Factory

**패키지:** `org.koin.core.annotation`

**대상:** `CLASS`, `FUNCTION`

**설명:** 타입 또는 함수를 Koin의 `factory` 정의로 선언합니다. 요청될 때마다 새 인스턴스가 생성됩니다.

**파라미터:**
- `binds: Array<KClass<*>> = [Unit::class]` - 이 정의에 바인딩할 명시적 타입입니다. 상위 타입은 자동으로 감지됩니다.

**동작:**
모든 종속성은 생성자 주입으로 채워집니다. 각 요청은 새 인스턴스를 생성합니다.

**예시:**
```kotlin
@Factory
class MyClass(val d : MyDependency)
```

**생성된 Koin DSL:**
```kotlin
factory { MyClass(get()) }
```

---

### @Scoped

**패키지:** `org.koin.core.annotation`

**대상:** `CLASS`, `FUNCTION`

**설명:** 타입 또는 함수를 Koin의 `scoped` 정의로 선언합니다. `@Scope` 어노테이션과 연결되어야 합니다. 인스턴스는 특정 스코프 내에서 공유됩니다.

**파라미터:**
- `binds: Array<KClass<*>> = [Unit::class]` - 이 정의에 바인딩할 명시적 타입입니다. 상위 타입은 자동으로 감지됩니다.

**동작:**
정의된 스코프의 수명 주기 내에 존재하는 스코프 인스턴스를 생성합니다.

**예시:**
```kotlin
@Scope(MyScope::class)
@Scoped
class MyClass(val d : MyDependency)
```

**참고:** [@Scope](#scope)

---

## 스코프 어노테이션

### @Scope

**패키지:** `org.koin.core.annotation`

**대상:** `CLASS`, `FUNCTION`

**설명:** 클래스를 Koin 스코프에 선언합니다. 스코프 이름은 값(클래스) 또는 이름(문자열)으로 설명됩니다. 기본적으로 `scoped` 정의를 선언합니다. 명시적 바인딩을 위해 `@Scoped`, `@Factory`, `@KoinViewModel` 어노테이션으로 재정의할 수 있습니다.

**파라미터:**
- `value: KClass<*> = Unit::class` - 스코프 클래스 값
- `name: String = ""` - 스코프 문자열 값

**동작:**
지정된 스코프 타입 또는 이름과 연결된 스코프 정의를 생성합니다.

**클래스를 사용한 예시:**
```kotlin
@Scope(MyScope::class)
class MyClass(val d : MyDependency)
```

**생성된 Koin DSL:**
```kotlin
scope<MyScope> {
    scoped { MyClass(get()) }
}
```

**문자열 이름을 사용한 예시:**
```kotlin
@Scope(name = "my_custom_scope")
class MyClass(val d : MyDependency)
```

---

### @ViewModelScope

**패키지:** `org.koin.core.annotation`

**대상:** `CLASS`, `FUNCTION`

**설명:** 클래스를 `ViewModelScope` Koin 스코프에 선언합니다. 이는 ViewModel의 생명 주기 내에 존재해야 하는 컴포넌트를 위한 스코프 아키타입입니다.

**파라미터:** 없음

**동작:**
`viewModelScope` 내에서 스코프 정의를 생성합니다.

**예시:**
```kotlin
@ViewModelScope
class MyClass(val d : MyDependency)
```

**생성된 Koin DSL:**
```kotlin
viewModelScope {
    scoped { MyClass(get()) }
}
```

**사용법:**
태그된 클래스는 ViewModel 및 `viewModelScope` 함수와 함께 사용되어 스코프를 활성화하도록 되어 있습니다.

---

### @ActivityScope

**패키지:** `org.koin.android.annotation`

**대상:** `CLASS`, `FUNCTION`

**설명:** 클래스를 Activity Koin 스코프에 선언합니다.

**파라미터:** 없음

**동작:**
`activityScope` 내에서 스코프 정의를 생성합니다.

**예시:**
```kotlin
@ActivityScope
class MyClass(val d : MyDependency)
```

**생성된 Koin DSL:**
```kotlin
activityScope {
    scoped { MyClass(get()) }
}
```

**사용법:**
태그된 클래스는 Activity 및 `activityScope` 함수와 함께 사용되어 스코프를 활성화하도록 되어 있습니다.

---

### @ActivityRetainedScope

**패키지:** `org.koin.android.annotation`

**대상:** `CLASS`, `FUNCTION`

**설명:** 클래스를 Activity Koin 스코프에 선언하지만, 구성 변경 시에도 유지됩니다.

**파라미터:** 없음

**동작:**
`activityRetainedScope` 내에서 스코프 정의를 생성합니다.

**예시:**
```kotlin
@ActivityRetainedScope
class MyClass(val d : MyDependency)
```

**생성된 Koin DSL:**
```kotlin
activityRetainedScope {
    scoped { MyClass(get()) }
}
```

**사용법:**
태그된 클래스는 Activity 및 `activityRetainedScope` 함수와 함께 사용되어 스코프를 활성화하도록 되어 있습니다.

---

### @FragmentScope

**패키지:** `org.koin.android.annotation`

**대상:** `CLASS`, `FUNCTION`

**설명:** 클래스를 Fragment Koin 스코프에 선언합니다.

**파라미터:** 없음

**동작:**
`fragmentScope` 내에서 스코프 정의를 생성합니다.

**예시:**
```kotlin
@FragmentScope
class MyClass(val d : MyDependency)
```

**생성된 Koin DSL:**
```kotlin
fragmentScope {
    scoped { MyClass(get()) }
}
```

**사용법:**
태그된 클래스는 Fragment 및 `fragmentScope` 함수와 함께 사용되어 스코프를 활성화하도록 되어 있습니다.

---

### @ScopeId

**패키지:** `org.koin.core.annotation`

**대상:** `VALUE_PARAMETER`

**설명:** 클래스 생성자 또는 함수의 파라미터에 어노테이션을 달아, 주어진 스코프 ID로 스코프에 대한 해결을 요청합니다.

**파라미터:**
- `value: KClass<*> = Unit::class` - 스코프 타입
- `name: String = ""` - 스코프 문자열 식별자

**동작:**
타입 또는 이름으로 식별된 특정 스코프에서 종속성을 해결합니다.

**문자열 이름을 사용한 예시:**
```kotlin
@Factory
class MyClass(@ScopeId(name = "my_scope_id") val d : MyDependency)
```

**생성된 Koin DSL:**
```kotlin
factory { MyClass(getScope("my_scope_id").get()) }
```

**타입을 사용한 예시:**
```kotlin
@Factory
class MyClass(@ScopeId(MyScope::class) val d : MyDependency)
```

---

## ViewModel 및 Android 관련 어노테이션

### @KoinViewModel

**패키지:** `org.koin.android.annotation`

**대상:** `CLASS`, `FUNCTION`

**설명:** Koin 정의를 위한 ViewModel 어노테이션입니다. 타입 또는 함수를 Koin의 `viewModel` 정의로 선언합니다.

**플랫폼 지원:**
- ✅ Android
- ✅ Kotlin Multiplatform (KMP)
- ✅ Compose Multiplatform (CMP)

**파라미터:**
- `binds: Array<KClass<*>> = []` - 이 정의에 바인딩할 명시적 타입입니다. 상위 타입은 자동으로 감지됩니다.

**동작:**
모든 종속성은 생성자 주입으로 채워집니다. Koin에 의해 관리되는 ViewModel 인스턴스를 생성합니다. Compose Multiplatform을 사용할 때 Android, iOS, Desktop 및 Web을 포함한 모든 플랫폼에서 작동합니다.

**예시 (Android/CMP):**
```kotlin
@KoinViewModel
class MyViewModel(val d : MyDependency) : ViewModel()
```

**예시 (KMP/CMP 공유):**
```kotlin
@KoinViewModel
class SharedViewModel(
    val repository: Repository,
    val analytics: Analytics
) : ViewModel()
```

**생성된 Koin DSL:**
```kotlin
viewModel { MyViewModel(get()) }
```

---

### @KoinWorker

**패키지:** `org.koin.android.annotation`

**대상:** `CLASS`, `FUNCTION`

**설명:** Koin 정의를 위한 Worker 어노테이션입니다. 타입을 WorkManager 워커를 위한 `worker` 정의로 선언합니다.

**파라미터:**
- `binds: Array<KClass<*>> = []` - 이 정의에 바인딩할 명시적 타입입니다.

**동작:**
Android WorkManager 통합을 위한 워커 정의를 생성합니다.

**예시:**
```kotlin
@KoinWorker
class MyWorker() : Worker()
```

---

## 한정자 어노테이션

### @Named

**패키지:** `org.koin.core.annotation`

**대상:** `CLASS`, `FUNCTION`, `VALUE_PARAMETER`

**설명:** 주어진 정의에 대한 한정자(qualifier)를 정의합니다. `StringQualifier("...")` 또는 타입 기반 한정자를 생성합니다.

**파라미터:**
- `value: String = ""` - 문자열 한정자
- `type: KClass<*> = Unit::class` - 클래스 한정자

**동작:**
동일한 타입의 여러 정의를 구별하는 데 사용됩니다.

**문자열을 사용한 예시:**
```kotlin
@Single
@Named("special")
class MyClass(val d : MyDependency)
```

**파라미터에서의 사용법:**
```kotlin
@Single
class Consumer(@Named("special") val myClass: MyClass)
```

**타입을 사용한 예시:**
```kotlin
@Single
@Named(type = MyType::class)
class MyClass(val d : MyDependency)
```

---

### @Qualifier

**패키지:** `org.koin.core.annotation`

**대상:** `CLASS`, `FUNCTION`, `VALUE_PARAMETER`

**설명:** 주어진 정의에 대한 한정자를 정의합니다. `@Named`와 유사하지만 파라미터 우선순위가 역순입니다.

**파라미터:**
- `value: KClass<*> = Unit::class` - 클래스 한정자
- `name: String = ""` - 문자열 한정자

**동작:**
동일한 타입의 여러 정의를 구별하는 데 사용됩니다.

**예시:**
```kotlin
@Single
@Qualifier(name = "special")
class MyClass(val d : MyDependency)
```

---

## 속성 어노테이션

### @Property

**패키지:** `org.koin.core.annotation`

**대상:** `VALUE_PARAMETER`

**설명:** 생성자 파라미터 또는 함수 파라미터에 어노테이션을 달아 Koin 속성으로 해결하도록 합니다.

**파라미터:**
- `value: String` - 속성 이름

**동작:**
의존성 주입 대신 Koin 속성에서 파라미터 값을 해결합니다.

**예시:**
```kotlin
@Factory
class MyClass(@Property("name") val name : String)
```

**생성된 Koin DSL:**
```kotlin
factory { MyClass(getProperty("name")) }
```

**기본값 사용:**
```kotlin
@PropertyValue("name")
val defaultName = "MyName"

@Factory
class MyClass(@Property("name") val name : String)
```

**생성된 Koin DSL:**
```kotlin
factory { MyClass(getProperty("name", defaultName)) }
```

---

### @PropertyValue

**패키지:** `org.koin.core.annotation`

**대상:** `FIELD`

**설명:** 속성의 기본값이 될 필드 값에 어노테이션을 답니다.

**파라미터:**
- `value: String` - 속성 이름

**동작:**
속성을 찾을 수 없을 때 사용할 수 있는 속성의 기본값을 정의합니다.

**예시:**
```kotlin
@PropertyValue("name")
val defaultName = "MyName"

@Factory
class MyClass(@Property("name") val name : String)
```

**생성된 Koin DSL:**
```kotlin
factory { MyClass(getProperty("name", defaultName)) }
```

---

## 모듈 및 애플리케이션 어노테이션

### @Module

**패키지:** `org.koin.core.annotation`

**대상:** `CLASS`

**설명:** Koin 모듈 내에 정의를 모으는 데 도움이 되는 클래스 어노테이션입니다. 각 함수에는 Koin 정의 어노테이션을 달 수 있습니다.

**파라미터:**
- `includes: Array<KClass<*>> = []` - 포함할 모듈 클래스
- `createdAtStart: Boolean = false` - `true`인 경우, 모듈 인스턴스가 시작 시 생성됩니다.

**동작:**
모듈 내의 모든 어노테이션이 지정된 함수와 클래스를 수집합니다.

**예시:**
```kotlin
@Module
class MyModule {
    @Single
    fun myClass(d : MyDependency) = MyClass(d)
}
```

**생성된 Koin DSL:**
```kotlin
val MyModule.module = module {
    val moduleInstance = MyModule()
    single { moduleInstance.myClass(get()) }
}
```

**포함 기능 사용:**
```kotlin
@Module(includes = [OtherModule::class])
class MyModule {
    // definitions
}
```

---

### @ComponentScan

**패키지:** `org.koin.core.annotation`

**대상:** `CLASS`, `FIELD`

**설명:** Koin 정의 어노테이션으로 선언된 정의를 수집합니다. 현재 패키지 또는 명시적 패키지 이름을 스캔합니다.

**파라미터:**
- `value: vararg String = []` - 스캔할 패키지 (글로브 패턴 지원)

**동작:**
지정된 패키지에서 어노테이션이 지정된 클래스를 스캔합니다. 정확한 패키지 이름과 글로브 패턴을 모두 지원합니다.

**글로브 패턴 지원:**

1.  **정확한 패키지 이름 (와일드카드 없음):**
    - `com.example.service` - 패키지 및 모든 하위 패키지 스캔 ( `com.example**`와 동일)

2.  **루트를 포함한 다단계 스캔:**
    - `com.example**` - `com.example` 및 모든 하위 패키지 스캔

3.  **루트를 제외한 다단계 스캔:**
    - `com.example.**` - `com.example`의 하위 패키지만 스캔, 루트는 제외

4.  **단일 레벨 와일드카드:**
    - `com.example.*.service` - 정확히 한 레벨 일치 (예: `com.example.user.service`)

5.  **결합된 와일드카드:**
    - `com.**.service.*data` - 복합 패턴 일치
    - `com.*.service.**` - 패턴에 따라 하위 패키지 스캔

**예시 - 현재 패키지 스캔:**
```kotlin
@ComponentScan
class MyApp
```

**예시 - 특정 패키지 스캔:**
```kotlin
@ComponentScan("com.example.services", "com.example.repositories")
class MyApp
```

**예시 - 글로브 패턴 사용:**
```kotlin
@ComponentScan("com.example.**", "org.app.*.services")
class MyApp
```

---

### @Configuration

**패키지:** `org.koin.core.annotation`

**대상:** `CLASS`, `FIELD`

**설명:** `@Module` 클래스에 적용되어 하나 이상의 구성(태그/플레이버)과 연결합니다.

**파라미터:**
- `value: vararg String = []` - 구성 이름

**동작:**
모듈은 조건부 로딩을 위해 구성으로 그룹화될 수 있습니다.

**기본 구성:**
```kotlin
@Module
@Configuration
class MyModule
```
이 모듈은 "default" 구성의 일부입니다.

**여러 구성:**
```kotlin
@Module
@Configuration("prod", "test")
class MyModule
```
이 모듈은 "prod" 및 "test" 구성에서 모두 사용할 수 있습니다.

**기본값 사용:**
```kotlin
@Module
@Configuration("default", "test")
class MyModule
```
기본 및 테스트 구성에서 사용할 수 있습니다.

**참고:** `@Configuration("default")`는 `@Configuration`과 동일합니다.

---

### @KoinApplication

**패키지:** `org.koin.core.annotation`

**대상:** `CLASS`

**설명:** 클래스를 Koin 애플리케이션 진입점으로 태그합니다. `startKoin()` 또는 `koinApplication()` 함수를 사용하여 Koin 애플리케이션 부트스트랩을 생성합니다.

**파라미터:**
- `configurations: Array<String> = []` - 스캔할 구성 이름 목록
- `modules: Array<KClass<*>> = [Unit::class]` - 구성 외에 로드할 모듈 목록

**동작:**
구성과 포함된 모듈을 스캔하는 부트스트랩 함수를 생성합니다.

**예시 - 기본 구성:**
```kotlin
@KoinApplication
class MyApp
```

**생성된 함수:**
```kotlin
MyApp.startKoin()
MyApp.koinApplication()
```

**예시 - 특정 구성:**
```kotlin
@KoinApplication(configurations = ["default", "prod"])
class MyApp
```

**예시 - 모듈 사용:**
```kotlin
@KoinApplication(
    configurations = ["default"],
    modules = [CoreModule::class, ApiModule::class]
)
class MyApp
```

**커스텀 구성과 함께 사용:**
```kotlin
MyApp.startKoin {
    printLogger()
    // additional configuration
}
```

---

## 모니터링 어노테이션

### @Monitor

**패키지:** `org.koin.core.annotation`

**대상:** `CLASS`, `FUNCTION`

**설명:** Kotzilla Platform (Koin의 공식 툴링 플랫폼)을 통한 자동 모니터링 및 성능 추적을 위해 클래스 또는 함수를 표시합니다.

**파라미터:** 없음

**동작:**
- 클래스에 적용될 때: 모든 공개 메서드 호출을 모니터링하는 Koin 프록시를 생성합니다.
- 함수에 적용될 때: Koin 관리 컴포넌트 내에서 해당 특정 메서드를 모니터링합니다.
- 성능 지표, 오류율 및 사용 패턴을 자동으로 캡처합니다.
- 실시간 분석을 위해 Kotzilla 작업 공간으로 데이터를 보냅니다.

**요구 사항:**
- `implementation 'io.kotzilla:kotzilla-core:latest.version'`
- 유효한 Kotzilla Platform 계정 및 API 키

**예시:**
```kotlin
@Monitor
class UserService(private val userRepository: UserRepository) {
    fun findUser(id: String): User? = userRepository.findById(id)
}
```

**자료:**
- [Kotzilla Platform](https://kotzilla.io)
- [전체 문서](https://doc.kotzilla.io)
- [최신 버전](https://doc.kotzilla.io/docs/releaseNotes/changelogSDK)

**적용 시기:** Kotzilla 1.2.1

---

## 메타 어노테이션 (내부용)

이 어노테이션은 Koin 컴파일러 및 코드 생성에서만 내부적으로 사용됩니다.

### @ExternalDefinition

**패키지:** `org.koin.meta.annotations`

**대상:** `CLASS`, `FIELD`, `FUNCTION`

**설명:** 생성된 패키지에서 컴포넌트 검색을 위한 내부 사용입니다.

**파라미터:**
- `value: String = ""` - 선언된 정의의 패키지

---

### @MetaDefinition

**패키지:** `org.koin.meta.annotations`

**대상:** `CLASS`, `FUNCTION`, `PROPERTY`

**설명:** 정의 메타데이터를 나타내는 데 도움이 되는 메타 정의 어노테이션입니다.

**파라미터:**
- `value: String = ""` - 정의 전체 경로
- `moduleTagId: String = ""` - 모듈 태그 + ID (형식: "module_id:module_tag")
- `dependencies: Array<String> = []` - 확인할 파라미터 태그
- `binds: Array<String> = []` - 바인딩된 타입
- `qualifier: String = ""` - 한정자
- `scope: String = ""` - 선언된 스코프

---

### @MetaModule

**패키지:** `org.koin.meta.annotations`

**대상:** `CLASS`

**설명:** 모듈 메타데이터를 나타내는 데 도움이 되는 메타 모듈 어노테이션입니다.

**파라미터:**
- `value: String = ""` - 모듈 전체 경로
- `id: String = ""` - 모듈 ID
- `includes: Array<String> = []` - 확인할 포함 모듈 태그
- `configurations: Array<String> = []` - 확인할 모듈 구성
- `isObject: Boolean = false` - 모듈이 객체인지 여부

---

### @MetaApplication

**패키지:** `org.koin.meta.annotations`

**대상:** `CLASS`

**설명:** 애플리케이션 메타데이터를 나타내는 데 도움이 되는 메타 애플리케이션 어노테이션입니다.

**파라미터:**
- `value: String = ""` - 애플리케이션 전체 경로
- `includes: Array<String> = []` - 확인할 사용된 모듈 태그
- `configurations: Array<String> = []` - 확인할 사용된 구성 모듈

---

## 사용 중단된 어노테이션

### @Singleton

**패키지:** `org.koin.core.annotation`

**상태:** 사용 중단됨 - ERROR 수준

**대체:** `koin-jsr330` 패키지의 `@Singleton`을 대신 사용하세요.

**설명:** `@Single`과 동일하지만 JSR-330 준수를 위해 사용이 중단되었습니다.

---

## 요약 표

| 어노테이션 | 패키지 | 목적 | 일반적인 사용 사례 |
|------------|---------|---------|-----------------|
| `@Single` | `org.koin.core.annotation` | 싱글턴 정의 | 공유 애플리케이션 서비스 |
| `@Factory` | `org.koin.core.annotation` | 팩토리 정의 | 요청별 인스턴스 |
| `@Scoped` | `org.koin.core.annotation` | 스코프 정의 | 스코프별 인스턴스 |
| `@Scope` | `org.koin.core.annotation` | 스코프 선언 | 커스텀 스코프 |
| `@ViewModelScope` | `org.koin.core.annotation` | ViewModel 스코프 | ViewModel 스코프 종속성 |
| `@ActivityScope` | `org.koin.android.annotation` | 액티비티 스코프 | 액티비티 스코프 종속성 |
| `@ActivityRetainedScope` | `org.koin.android.annotation` | 유지되는 액티비티 스코프 | 구성 변경에 유지되는 종속성 |
| `@FragmentScope` | `org.koin.android.annotation` | 프래그먼트 스코프 | 프래그먼트 스코프 종속성 |
| `@ScopeId` | `org.koin.core.annotation` | 스코프 해결 | 특정 스코프에서 해결 |
| `@KoinViewModel` | `org.koin.android.annotation` | ViewModel 정의 | Android/KMP/CMP ViewModel |
| `@KoinWorker` | `org.koin.android.annotation` | 워커 정의 | WorkManager 워커 |
| `@Named` | `org.koin.core.annotation` | 문자열/타입 한정자 | 동일 타입 빈 구별 |
| `@Qualifier` | `org.koin.core.annotation` | 타입/문자열 한정자 | 동일 타입 빈 구별 |
| `@Property` | `org.koin.core.annotation` | 속성 주입 | 구성 값 |
| `@PropertyValue` | `org.koin.core.annotation` | 속성 기본값 | 기본 구성 값 |
| `@Module` | `org.koin.core.annotation` | 모듈 선언 | 정의 그룹화 |
| `@ComponentScan` | `org.koin.core.annotation` | 패키지 스캔 | 정의 자동 검색 |
| `@Configuration` | `org.koin.core.annotation` | 모듈 구성 | 빌드 변형/플레이버 |
| `@KoinApplication` | `org.koin.core.annotation` | 앱 진입점 | Koin 부트스트랩 |
| `@Monitor` | `org.koin.core.annotation` | 성능 모니터링 | 프로덕션 모니터링 |

---

**문서 버전:** 1.0
**최종 업데이트:** 20-10-2025
**Koin 어노테이션 버전:** 2.2.x+