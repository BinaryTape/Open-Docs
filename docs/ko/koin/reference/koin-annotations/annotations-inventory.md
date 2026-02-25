# Koin 어노테이션 목록 (Inventory)

이 문서는 모든 Koin 어노테이션, 매개변수, 동작 및 사용 예제에 대한 포괄적인 목록을 제공합니다.

## 목차

- [정의 어노테이션 (Definition Annotations)](#definition-annotations)
  - [@Single](#single)
  - [@Factory](#factory)
  - [@Scoped](#scoped)
- [스코프 어노테이션 (Scope Annotations)](#scope-annotations)
  - [@Scope](#scope)
  - [@ViewModelScope](#viewmodelscope)
  - [@ActivityScope](#activityscope)
  - [@ActivityRetainedScope](#activityretainedscope)
  - [@FragmentScope](#fragmentscope)
  - [@ScopeId](#scopeid)
- [ViewModel 및 Android 전용 어노테이션](#viewmodel--android-specific-annotations)
  - [@KoinViewModel](#koinviewmodel)
  - [@KoinWorker](#koinworker)
- [한정자 어노테이션 (Qualifier Annotations)](#qualifier-annotations)
  - [@Named](#named)
  - [@Qualifier](#qualifier)
- [프로퍼티 어노테이션 (Property Annotations)](#property-annotations)
  - [@Property](#property)
  - [@PropertyValue](#propertyvalue)
- [모듈 및 애플리케이션 어노테이션](#module--application-annotations)
  - [@Module](#module)
  - [@ComponentScan](#componentscan)
  - [@Configuration](#configuration)
  - [@KoinApplication](#koinapplication)
- [모니터링 어노테이션](#monitoring-annotations)
  - [@Monitor](#monitor)
- [메타 어노테이션 (Internal)](#meta-annotations-internal)
  - [@ExternalDefinition](#externaldefinition)
  - [@MetaDefinition](#metadefinition)
  - [@MetaModule](#metamodule)
  - [@MetaApplication](#metaapplication)

---

## 정의 어노테이션 (Definition Annotations)

### @Single

**패키지:** `org.koin.core.annotation`

**대상:** `CLASS`, `FUNCTION`

**설명:** Koin에서 타입이나 함수를 `single`(싱글톤) 정의로 선언합니다. 단일 인스턴스가 생성되어 애플리케이션 전체에서 공유됩니다.

**매개변수:**
- `binds: Array<KClass<*>> = [Unit::class]` - 이 정의에 바인딩할 명시적 타입입니다. 상위 타입(Supertypes)은 자동으로 감지됩니다.
- `createdAtStart: Boolean = false` - `true`인 경우, Koin이 시작될 때 인스턴스가 생성됩니다.

**동작:**
모든 의존성은 생성자 주입(Constructor Injection)을 통해 채워집니다.

**예제:**
```kotlin
@Single
class MyClass(val d : MyDependency)
```

**생성된 Koin DSL:**
```kotlin
single { MyClass(get()) }
```

**명시적 바인딩 사용:**
```kotlin
@Single(binds = [MyInterface::class])
class MyClass(val d : MyDependency) : MyInterface
```

**시작 시 생성 사용:**
```kotlin
@Single(createdAtStart = true)
class MyClass(val d : MyDependency)
```

---

### @Factory

**패키지:** `org.koin.core.annotation`

**대상:** `CLASS`, `FUNCTION`

**설명:** Koin에서 타입이나 함수를 `factory` 정의로 선언합니다. 요청될 때마다 새로운 인스턴스가 생성됩니다.

**매개변수:**
- `binds: Array<KClass<*>> = [Unit::class]` - 이 정의에 바인딩할 명시적 타입입니다. 상위 타입은 자동으로 감지됩니다.

**동작:**
모든 의존성은 생성자 주입을 통해 채워집니다. 각 요청마다 새로운 인스턴스를 생성합니다.

**예제:**
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

**설명:** Koin에서 타입이나 함수를 `scoped` 정의로 선언합니다. 반드시 `@Scope` 어노테이션과 함께 사용해야 합니다. 인스턴스는 특정 스코프 내에서 공유됩니다.

**매개변수:**
- `binds: Array<KClass<*>> = [Unit::class]` - 이 정의에 바인딩할 명시적 타입입니다. 상위 타입은 자동으로 감지됩니다.

**동작:**
정의된 스코프의 수명 주기 내에 존재하는 스코프 인스턴스를 생성합니다.

**예제:**
```kotlin
@Scope(MyScope::class)
@Scoped
class MyClass(val d : MyDependency)
```

**참고:** [@Scope](#scope)

---

## 스코프 어노테이션 (Scope Annotations)

### @Scope

**패키지:** `org.koin.core.annotation`

**대상:** `CLASS`, `FUNCTION`

**설명:** 클래스를 Koin 스코프에 선언합니다. 스코프 이름은 값(클래스) 또는 이름(문자열)으로 기술됩니다. 기본적으로 `scoped` 정의를 선언합니다. 명시적 바인딩을 위해 `@Scoped`, `@Factory`, `@KoinViewModel` 어노테이션으로 재정의할 수 있습니다.

**매개변수:**
- `value: KClass<*> = Unit::class` - 스코프 클래스 값
- `name: String = ""` - 스코프 문자열 값

**동작:**
지정된 스코프 타입 또는 이름과 연결된 스코프 정의를 생성합니다.

**클래스 사용 예제:**
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

**문자열 이름 사용 예제:**
```kotlin
@Scope(name = "my_custom_scope")
class MyClass(val d : MyDependency)
```

---

### @ViewModelScope

**패키지:** `org.koin.core.annotation`

**대상:** `CLASS`, `FUNCTION`

**설명:** 클래스를 ViewModelScope Koin 스코프에 선언합니다. 이는 ViewModel의 수명 주기 내에 존재해야 하는 컴포넌트를 위한 스코프 원형(Archetype)입니다.

**매개변수:** 없음

**동작:**
`viewModelScope` 내에 스코프 정의를 생성합니다.

**예제:**
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
태그된 클래스는 ViewModel 및 `viewModelScope` 함수와 함께 사용되어 스코프를 활성화하도록 설계되었습니다.

---

### @ActivityScope

**패키지:** `org.koin.android.annotation`

**대상:** `CLASS`, `FUNCTION`

**설명:** 클래스를 Activity Koin 스코프에 선언합니다.

**매개변수:** 없음

**동작:**
`activityScope` 내에 스코프 정의를 생성합니다.

**예제:**
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
태그된 클래스는 Activity 및 `activityScope` 함수와 함께 사용되어 스코프를 활성화하도록 설계되었습니다.

---

### @ActivityRetainedScope

**패키지:** `org.koin.android.annotation`

**대상:** `CLASS`, `FUNCTION`

**설명:** 클래스를 Activity Koin 스코프에 선언하지만, 구성 변경(Configuration changes) 시에도 유지되도록 합니다.

**매개변수:** 없음

**동작:**
`activityRetainedScope` 내에 스코프 정의를 생성합니다.

**예제:**
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
태그된 클래스는 Activity 및 `activityRetainedScope` 함수와 함께 사용되어 스코프를 활성화하도록 설계되었습니다.

---

### @FragmentScope

**패키지:** `org.koin.android.annotation`

**대상:** `CLASS`, `FUNCTION`

**설명:** 클래스를 Fragment Koin 스코프에 선언합니다.

**매개변수:** 없음

**동작:**
`fragmentScope` 내에 스코프 정의를 생성합니다.

**예제:**
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
태그된 클래스는 Fragment 및 `fragmentScope` 함수와 함께 사용되어 스코프를 활성화하도록 설계되었습니다.

---

### @ScopeId

**패키지:** `org.koin.core.annotation`

**대상:** `VALUE_PARAMETER`

**설명:** 클래스 생성자 또는 함수의 매개변수에 어노테이션을 달아, 지정된 스코프 ID를 가진 스코프에서 의존성을 해결(Resolution)하도록 요청합니다.

**매개변수:**
- `value: KClass<*> = Unit::class` - 스코프 타입
- `name: String = ""` - 스코프 문자열 식별자

**동작:**
타입 또는 이름으로 식별되는 특정 스코프에서 의존성을 해결합니다.

**문자열 이름 사용 예제:**
```kotlin
@Factory
class MyClass(@ScopeId(name = "my_scope_id") val d : MyDependency)
```

**생성된 Koin DSL:**
```kotlin
factory { MyClass(getScope("my_scope_id").get()) }
```

**타입 사용 예제:**
```kotlin
@Factory
class MyClass(@ScopeId(MyScope::class) val d : MyDependency)
```

---

## ViewModel 및 Android 전용 어노테이션

### @KoinViewModel

**패키지:** `org.koin.android.annotation`

**대상:** `CLASS`, `FUNCTION`

**설명:** Koin 정의를 위한 ViewModel 어노테이션입니다. Koin에서 타입이나 함수를 `viewModel` 정의로 선언합니다.

**플랫폼 지원:**
- ✅ Android
- ✅ Kotlin Multiplatform (KMP)
- ✅ Compose Multiplatform (CMP)

**매개변수:**
- `binds: Array<KClass<*>> = []` - 이 정의에 바인딩할 명시적 타입입니다. 상위 타입은 자동으로 감지됩니다.

**동작:**
모든 의존성은 생성자 주입을 통해 채워집니다. Koin에 의해 관리되는 ViewModel 인스턴스를 생성합니다. Compose Multiplatform을 사용할 때 Android, iOS, Desktop, Web을 포함한 모든 플랫폼에서 작동합니다.

**예제 (Android/CMP):**
```kotlin
@KoinViewModel
class MyViewModel(val d : MyDependency) : ViewModel()
```

**예제 (KMP/CMP 공통):**
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

**설명:** Koin 정의를 위한 Worker 어노테이션입니다. WorkManager 워커를 위한 `worker` 정의로 타입을 선언합니다.

**매개변수:**
- `binds: Array<KClass<*>> = []` - 이 정의에 바인딩할 명시적 타입입니다.

**동작:**
Android WorkManager 연동을 위한 워커 정의를 생성합니다.

**예제:**
```kotlin
@KoinWorker
class MyWorker() : Worker()
```

---

## 한정자 어노테이션 (Qualifier Annotations)

### @Named

**패키지:** `org.koin.core.annotation`

**대상:** `CLASS`, `FUNCTION`, `VALUE_PARAMETER`

**설명:** 주어진 정의에 대한 한정자(Qualifier)를 정의합니다. `StringQualifier("...")` 또는 타입 기반 한정자를 생성합니다.

**매개변수:**
- `value: String = ""` - 문자열 한정자
- `type: KClass<*> = Unit::class` - 클래스 한정자

**동작:**
동일한 타입의 여러 정의를 구분하는 데 사용됩니다.

**문자열 사용 예제:**
```kotlin
@Single
@Named("special")
class MyClass(val d : MyDependency)
```

**매개변수에서 사용:**
```kotlin
@Single
class Consumer(@Named("special") val myClass: MyClass)
```

**타입 사용 예제:**
```kotlin
@Single
@Named(type = MyType::class)
class MyClass(val d : MyDependency)
```

---

### @Qualifier

**패키지:** `org.koin.core.annotation`

**대상:** `CLASS`, `FUNCTION`, `VALUE_PARAMETER`

**설명:** 주어진 정의에 대한 한정자를 정의합니다. `@Named`와 유사하지만 매개변수 우선순위가 반대입니다.

**매개변수:**
- `value: KClass<*> = Unit::class` - 클래스 한정자
- `name: String = ""` - 문자열 한정자

**동작:**
동일한 타입의 여러 정의를 구분하는 데 사용됩니다.

**예제:**
```kotlin
@Single
@Qualifier(name = "special")
class MyClass(val d : MyDependency)
```

---

## 프로퍼티 어노테이션 (Property Annotations)

### @Property

**패키지:** `org.koin.core.annotation`

**대상:** `VALUE_PARAMETER`

**설명:** 생성자 매개변수나 함수 매개변수에 어노테이션을 달아 Koin 프로퍼티로 해결하도록 합니다.

**매개변수:**
- `value: String` - 프로퍼티 이름

**동작:**
의존성 주입 대신 Koin 프로퍼티에서 매개변수 값을 해결합니다.

**예제:**
```kotlin
@Factory
class MyClass(@Property("name") val name : String)
```

**생성된 Koin DSL:**
```kotlin
factory { MyClass(getProperty("name")) }
```

**기본값과 함께 사용:**
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

**설명:** 프로퍼티의 기본값이 될 필드 값에 어노테이션을 답니다.

**매개변수:**
- `value: String` - 프로퍼티 이름

**동작:**
프로퍼티를 찾을 수 없을 때 사용할 기본값을 정의합니다.

**예제:**
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

**설명:** Koin 모듈 내부의 정의들을 모으는 데 도움을 주는 클래스 어노테이션입니다. 각 함수는 Koin 정의 어노테이션을 가질 수 있습니다.

**매개변수:**
- `includes: Array<KClass<*>> = []` - 포함할 모듈 클래스들
- `createdAtStart: Boolean = false` - `true`인 경우, 모듈 인스턴스가 시작 시 생성됩니다.

**동작:**
모듈 내의 모든 어노테이션된 함수와 클래스를 수집합니다.

**예제:**
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

**includes와 함께 사용:**
```kotlin
@Module(includes = [OtherModule::class])
class MyModule {
    // 정의들
}
```

---

### @ComponentScan

**패키지:** `org.koin.core.annotation`

**대상:** `CLASS`, `FIELD`

**설명:** Koin 정의 어노테이션으로 선언된 정의들을 수집합니다. 현재 패키지나 명시적인 패키지 이름을 스캔합니다.

**매개변수:**
- `value: vararg String = []` - 스캔할 패키지 (glob 패턴 지원)

**동작:**
지정된 패키지에서 어노테이션이 달린 클래스를 스캔합니다. 정확한 패키지 이름과 glob 패턴을 모두 지원합니다.

**Glob 패턴 지원:**

1. **정확한 패키지 이름 (와일드카드 없음):**
   - `com.example.service` - 패키지와 모든 하위 패키지를 스캔합니다 (`com.example**`와 동일).

2. **루트를 포함한 다중 레벨 스캔:**
   - `com.example**` - `com.example` 및 모든 하위 패키지를 스캔합니다.

3. **루트를 제외한 다중 레벨 스캔:**
   - `com.example.**` - `com.example`의 하위 패키지만 스캔하고 루트는 제외합니다.

4. **단일 레벨 와일드카드:**
   - `com.example.*.service` - 정확히 한 레벨만 일치시킵니다 (예: `com.example.user.service`).

5. **복합 와일드카드:**
   - `com.**.service.*data` - 복잡한 패턴 매칭
   - `com.*.service.**` - 패턴 하위의 패키지들을 스캔

**예제 - 현재 패키지 스캔:**
```kotlin
@ComponentScan
class MyApp
```

**예제 - 특정 패키지 스캔:**
```kotlin
@ComponentScan("com.example.services", "com.example.repositories")
class MyApp
```

**예제 - glob 패턴 사용:**
```kotlin
@ComponentScan("com.example.**", "org.app.*.services")
class MyApp
```

---

### @Configuration

**패키지:** `org.koin.core.annotation`

**대상:** `CLASS`, `FIELD`

**설명:** `@Module` 클래스에 적용하여 하나 이상의 구성(태그/플레이버)과 연결합니다.

**매개변수:**
- `value: vararg String = []` - 구성 이름

**동작:**
조건부 로딩을 위해 모듈을 구성별로 그룹화할 수 있습니다.

**기본 구성:**
```kotlin
@Module
@Configuration
class MyModule
```
이 모듈은 "default" 구성의 일부입니다.

**다중 구성:**
```kotlin
@Module
@Configuration("prod", "test")
class MyModule
```
이 모듈은 "prod" 및 "test" 구성 모두에서 사용 가능합니다.

**기본값과 함께 사용:**
```kotlin
@Module
@Configuration("default", "test")
class MyModule
```
default 및 test 구성에서 사용 가능합니다.

**참고:** `@Configuration("default")`는 `@Configuration`과 동일합니다.

---

### @KoinApplication

**패키지:** `org.koin.core.annotation`

**대상:** `CLASS`

**설명:** 클래스를 Koin 애플리케이션 진입점으로 태그합니다. `startKoin()` 또는 `koinApplication()` 함수로 Koin 애플리케이션 부트스트랩을 생성합니다.

**매개변수:**
- `configurations: Array<String> = []` - 스캔할 구성 이름 목록
- `modules: Array<KClass<*>> = [Unit::class]` - 구성 외에 로드할 모듈 목록

**동작:**
구성과 포함된 모듈을 스캔하는 부트스트랩 함수를 생성합니다.

**예제 - 기본 구성:**
```kotlin
@KoinApplication
class MyApp
```

**생성된 함수:**
```kotlin
MyApp.startKoin()
MyApp.koinApplication()
```

**예제 - 특정 구성:**
```kotlin
@KoinApplication(configurations = ["default", "prod"])
class MyApp
```

**예제 - 모듈과 함께 사용:**
```kotlin
@KoinApplication(
    configurations = ["default"],
    modules = [CoreModule::class, ApiModule::class]
)
class MyApp
```

**사용자 정의 구성과 함께 사용:**
```kotlin
MyApp.startKoin {
    printLogger()
    // 추가 구성
}
```

---

## 모니터링 어노테이션

### @Monitor

**패키지:** `org.koin.core.annotation`

**대상:** `CLASS`, `FUNCTION`

**설명:** Koin의 공식 툴링 플랫폼인 Kotzilla Platform을 통해 자동 모니터링 및 성능 추적을 수행하도록 클래스나 함수를 표시합니다.

**매개변수:** 없음

**동작:**
- 클래스에 적용 시: 모든 public 메서드 호출을 모니터링하는 Koin 프록시를 생성합니다.
- 함수에 적용 시: Koin 관리 컴포넌트 내의 해당 특정 메서드를 모니터링합니다.
- 성능 메트릭, 오류율 및 사용 패턴을 자동으로 캡처합니다.
- 실시간 분석을 위해 데이터를 Kotzilla 워크스페이스로 전송합니다.

**요구 사항:**
- `implementation 'io.kotzilla:kotzilla-core:latest.version'`
- 유효한 Kotzilla Platform 계정 및 API 키

**예제:**
```kotlin
@Monitor
class UserService(private val userRepository: UserRepository) {
    fun findUser(id: String): User? = userRepository.findById(id)
}
```

**리소스:**
- [Kotzilla Platform](https://kotzilla.io)
- [전체 문서](https://doc.kotzilla.io)
- [최신 버전](https://doc.kotzilla.io/docs/releaseNotes/changelogSDK)

**도입 버전:** Kotzilla 1.2.1

---

## 메타 어노테이션 (Internal)

이 어노테이션들은 Koin 컴파일러 및 코드 생성에 의한 내부 용도로만 사용됩니다.

### @ExternalDefinition

**패키지:** `org.koin.meta.annotations`

**대상:** `CLASS`, `FIELD`, `FUNCTION`

**설명:** 생성된 패키지에서의 컴포넌트 탐색을 위한 내부 용도입니다.

**매개변수:**
- `value: String = ""` - 선언된 정의의 패키지

---

### @MetaDefinition

**패키지:** `org.koin.meta.annotations`

**대상:** `CLASS`, `FUNCTION`, `PROPERTY`

**설명:** 정의 메타데이터를 표현하는 데 도움을 주는 메타 정의 어노테이션입니다.

**매개변수:**
- `value: String = ""` - 정의의 전체 경로
- `moduleTagId: String = ""` - 모듈 태그 + ID ("module_id:module_tag" 형식)
- `dependencies: Array<String> = []` - 확인할 매개변수 태그들
- `binds: Array<String> = []` - 바인딩된 타입들
- `qualifier: String = ""` - 한정자
- `scope: String = ""` - 선언된 스코프

---

### @MetaModule

**패키지:** `org.koin.meta.annotations`

**대상:** `CLASS`

**설명:** 모듈 메타데이터를 표현하는 데 도움을 주는 메타 모듈 어노테이션입니다.

**매개변수:**
- `value: String = ""` - 모듈 전체 경로
- `id: String = ""` - 모듈 ID
- `includes: Array<String> = []` - 확인할 포함된 모듈 태그들
- `configurations: Array<String> = []` - 확인할 모듈 구성들
- `isObject: Boolean = false` - 모듈이 객체(object)인지 여부

---

### @MetaApplication

**패키지:** `org.koin.meta.annotations`

**대상:** `CLASS`

**설명:** 애플리케이션 메타데이터를 표현하는 데 도움을 주는 메타 애플리케이션 어노테이션입니다.

**매개변수:**
- `value: String = ""` - 애플리케이션 전체 경로
- `includes: Array<String> = []` - 확인할 사용된 모듈 태그들
- `configurations: Array<String> = []` - 확인할 사용된 구성 모듈들

---

## 지원 중단된 어노테이션 (Deprecated)

### @Singleton

**패키지:** `org.koin.core.annotation`

**상태:** DEPRECATED - ERROR level

**교체:** 대신 `koin-jsr330` 패키지의 `@Singleton`을 사용하세요.

**설명:** `@Single`과 동일하지만 JSR-330 준수를 위해 지원 중단되었습니다.

---

## 요약 표

| 어노테이션 | 패키지 | 목적 | 일반적인 유스케이스 |
|------------|---------|---------|-----------------|
| `@Single` | `org.koin.core.annotation` | 싱글톤 정의 | 공유 애플리케이션 서비스 |
| `@Factory` | `org.koin.core.annotation` | 팩토리 정의 | 요청당 인스턴스 |
| `@Scoped` | `org.koin.core.annotation` | 스코프 정의 | 스코프별 인스턴스 |
| `@Scope` | `org.koin.core.annotation` | 스코프 선언 | 사용자 정의 스코프 |
| `@ViewModelScope` | `org.koin.core.annotation` | ViewModel 스코프 | ViewModel 스코프 의존성 |
| `@ActivityScope` | `org.koin.android.annotation` | Activity 스코프 | Activity 스코프 의존성 |
| `@ActivityRetainedScope` | `org.koin.android.annotation` | 유지되는 Activity 스코프 | 구성 변경 시 유지되는 의존성 |
| `@FragmentScope` | `org.koin.android.annotation` | Fragment 스코프 | Fragment 스코프 의존성 |
| `@ScopeId` | `org.koin.core.annotation` | 스코프 해결 | 특정 스코프에서 해결 |
| `@KoinViewModel` | `org.koin.android.annotation` | ViewModel 정의 | Android/KMP/CMP ViewModel |
| `@KoinWorker` | `org.koin.android.annotation` | Worker 정의 | WorkManager 워커 |
| `@Named` | `org.koin.core.annotation` | 문자열/타입 한정자 | 동일 타입 빈 구분 |
| `@Qualifier` | `org.koin.core.annotation` | 타입/문자열 한정자 | 동일 타입 빈 구분 |
| `@Property` | `org.koin.core.annotation` | 프로퍼티 주입 | 구성 값 |
| `@PropertyValue` | `org.koin.core.annotation` | 프로퍼티 기본값 | 기본 구성 값 |
| `@Module` | `org.koin.core.annotation` | 모듈 선언 | 정의 그룹화 |
| `@ComponentScan` | `org.koin.core.annotation` | 패키지 스캔 | 정의 자동 탐색 |
| `@Configuration` | `org.koin.core.annotation` | 모듈 구성 | 빌드 변체/플레이버 |
| `@KoinApplication` | `org.koin.core.annotation` | 앱 진입점 | Koin 부트스트랩 |
| `@Monitor` | `org.koin.core.annotation` | 성능 모니터링 | 프로덕션 모니터링 |

---

**문서 버전:** 1.0
**최종 업데이트:** 2025-10-20
**Koin Annotations 버전:** 2.2.x+