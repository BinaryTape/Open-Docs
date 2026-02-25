---
title: 모듈
---

Koin을 사용하면 모듈 내에 정의(definition)를 기술합니다. 이 섹션에서는 모듈을 선언하고, 구성하며, 연결하는 방법을 알아봅니다.

## 모듈이란 무엇인가요?

Koin 모듈은 Koin 정의(definition)를 모으는 "공간"입니다. `module` 함수를 사용하여 선언합니다.

```kotlin
val myModule = module {
    // 정의 내용 ...
}
```

## 여러 모듈 사용하기

컴포넌트들이 반드시 동일한 모듈에 있을 필요는 없습니다. 모듈은 정의를 정리하는 데 도움을 주는 논리적인 공간이며, 다른 모듈의 정의에 의존할 수 있습니다. 정의는 지연(lazy) 방식으로 처리되며, 컴포넌트가 요청할 때만 해결(resolve)됩니다.

각각 별개의 모듈에 있는 연결된 컴포넌트들의 예시를 살펴봅시다:

```kotlin
// ComponentB <- ComponentA
class ComponentA()
class ComponentB(val componentA : ComponentA)

val moduleA = module {
    // 싱글톤 ComponentA
    single { ComponentA() }
}

val moduleB = module {
    // 연결된 인스턴스 ComponentA를 가진 싱글톤 ComponentB
    single { ComponentB(get()) }
}
```

:::info 
Koin에는 임포트(import) 개념이 없습니다. Koin 정의는 지연 방식입니다. Koin 정의는 Koin 컨테이너와 함께 시작되지만 인스턴스화되지는 않습니다. 인스턴스는 해당 타입에 대한 요청이 발생했을 때만 생성됩니다.
:::

Koin 컨테이너를 시작할 때 사용할 모듈 리스트를 선언하기만 하면 됩니다:

```kotlin
// moduleA와 moduleB로 Koin 시작
startKoin {
    modules(moduleA,moduleB)
}
```

그러면 Koin은 제공된 모든 모듈로부터 의존성을 해결합니다.

## 정의 또는 모듈 재정의(3.1.0+)

새로운 Koin 재정의(override) 전략은 기본적으로 모든 정의를 재정의할 수 있도록 허용합니다. 이제 모듈에서 더 이상 `override = true`를 지정할 필요가 없습니다.

서로 다른 모듈에 동일한 매핑을 가진 두 개의 정의가 있는 경우, 마지막에 정의된 것이 현재 정의를 재정의합니다.

```kotlin
val myModuleA = module {
    single<Service> { ServiceImp() }
}
val myModuleB = module {
    single<Service> { TestServiceImp() }
}

startKoin {
    // TestServiceImp가 ServiceImp 정의를 재정의합니다.
    modules(myModuleA,myModuleB)
}
```

Koin 로그에서 정의 매핑 재정의에 관한 내용을 확인할 수 있습니다.

Koin 애플리케이션 설정에서 `allowOverride(false)`를 사용하여 재정의를 허용하지 않도록 지정할 수 있습니다:

```kotlin
startKoin {
    // 정의 재정의 금지
    allowOverride(false)
}
```

재정의를 비활성화한 경우, 재정의 시도가 있으면 Koin은 `DefinitionOverrideException` 예외를 던집니다.

## 모듈 공유하기

`module { }` 함수를 사용할 때 Koin은 모든 인스턴스 팩토리를 미리 할당합니다. 모듈을 공유해야 하는 경우, 함수를 통해 모듈을 반환하는 것을 고려해 보세요.

```kotlin
fun sharedModule() = module {
    // 정의 내용 ...
}
```

이렇게 하면 정의를 공유하면서 값(value)에 팩토리를 미리 할당하는 것을 피할 수 있습니다.

## 정의 또는 모듈 재정의(3.1.0 미만)

Koin은 이미 존재하는 정의(타입, 이름, 경로 등)를 다시 정의하는 것을 허용하지 않았습니다. 이를 시도하면 에러가 발생합니다:

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    single<Service> { TestServiceImp() }
}

// BeanOverrideException을 던집니다.
startKoin {
    modules(myModuleA,myModuleB)
}
```

정의 재정의를 허용하려면 `override` 파라미터를 사용해야 합니다:

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    // 이 정의에 대해 재정의 허용
    single<Service>(override=true) { TestServiceImp() }
}
```

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

// 모듈의 모든 정의에 대해 재정의 허용
val myModuleB = module(override=true) {

    single<Service> { TestServiceImp() }
}
```

:::note
모듈을 나열하고 정의를 재정의할 때는 순서가 중요합니다. 재정의하는 정의를 모듈 리스트의 마지막에 두어야 합니다.
:::

## 모듈 연결 전략

*모듈 간의 정의는 지연 방식이므로*, 모듈을 사용하여 서로 다른 전략 구현을 적용할 수 있습니다. 즉, 모듈당 하나의 구현을 선언하는 방식입니다.

Repository와 Datasource의 예시를 들어보겠습니다. Repository는 Datasource가 필요하며, Datasource는 Local 또는 Remote의 두 가지 방식으로 구현될 수 있습니다.

```kotlin
class Repository(val datasource : Datasource)
interface Datasource
class LocalDatasource() : Datasource
class RemoteDatasource() : Datasource
```

이 컴포넌트들을 3개의 모듈(Repository 모듈 하나와 Datasource 구현당 하나의 모듈)로 선언할 수 있습니다:

```kotlin
val repositoryModule = module {
    single { Repository(get()) }
}

val localDatasourceModule = module {
    single<Datasource> { LocalDatasource() }
}

val remoteDatasourceModule = module {
    single<Datasource> { RemoteDatasource() }
}
```

그런 다음 적절한 모듈 조합으로 Koin을 실행하기만 하면 됩니다:

```kotlin
// Repository + Local Datasource 정의 로드
startKoin {
    modules(repositoryModule,localDatasourceModule)
}

// Repository + Remote Datasource 정의 로드
startKoin {
    modules(repositoryModule,remoteDatasourceModule)
}
```

## 모듈 포함(3.2부터)

`Module` 클래스에서 새로운 함수인 `includes()`를 사용할 수 있습니다. 이를 통해 다른 모듈을 포함하여 조직적이고 구조적인 방식으로 모듈을 구성할 수 있습니다.

이 새로운 기능의 주요 두 가지 사용 사례는 다음과 같습니다:
- 큰 모듈을 더 작고 집중된 모듈로 분할합니다.
- 모듈화된 프로젝트에서 모듈 가시성(visibility)에 대한 더 세밀한 제어를 가능하게 합니다(아래 예시 참조).

작동 방식은 다음과 같습니다. 몇 가지 모듈을 만들고, `parentModule`에 모듈들을 포함시켜 보겠습니다:

```kotlin
// `:feature` 모듈
val childModule1 = module {
    /* 다른 정의들 */
}
val childModule2 = module {
    /* 다른 정의들 */
}
val parentModule = module {
    includes(childModule1, childModule2)
}

// `:app` 모듈
startKoin { modules(parentModule) }
```

모든 모듈을 명시적으로 설정할 필요가 없다는 점에 주목하세요. `parentModule`을 포함함으로써 `includes`에 선언된 모든 모듈(`childModule1` 및 `childModule2`)이 자동으로 로드됩니다. 즉, Koin은 결과적으로 `parentModule`, `childModule1`, `childModule2`를 로드하게 됩니다.

관찰해야 할 중요한 세부 사항은 `includes`를 사용하여 `internal` 및 `private` 모듈도 추가할 수 있다는 점입니다. 이는 모듈화된 프로젝트에서 무엇을 노출할지에 대한 유연성을 제공합니다.

:::info
이제 모듈 로딩이 최적화되어 모든 모듈 그래프를 평탄화(flatten)하고 모듈의 중복 정의를 방지합니다.
:::

마지막으로, 여러 개의 중첩되거나 중복된 모듈을 포함할 수 있으며, Koin은 모든 포함된 모듈을 평탄화하여 중복을 제거합니다:

```kotlin
// :feature 모듈
val dataModule = module {
    /* 다른 정의들 */
}
val domainModule = module {
    /* 다른 정의들 */
}
val featureModule1 = module {
    includes(domainModule, dataModule)
}
val featureModule2 = module {
    includes(domainModule, dataModule)
}

// `:app` 모듈
startKoin { modules(featureModule1, featureModule2) }
```

모든 모듈은 한 번만 포함됩니다: `dataModule`, `domainModule`, `featureModule1`, `featureModule2`.

:::info
동일한 파일에서 모듈을 포함하는 동안 컴파일 이슈가 발생하는 경우, 모듈에서 Kotlin 속성 연산자인 `get()`을 사용하거나 각 모듈을 별도의 파일로 분리하세요. https://github.com/InsertKoinIO/koin/issues/1341 해결 방법을 참조하세요.
:::