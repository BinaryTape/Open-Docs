---
title: 모듈
---

Koin을 사용하면 모듈에 정의를 기술합니다. 이 섹션에서는 모듈을 선언하고, 구성하며, 연결하는 방법을 알아봅니다.

## 모듈이란?

Koin 모듈은 Koin 정의를 모으는 "공간"입니다. 이는 `module` 함수로 선언됩니다.

```kotlin
val myModule = module {
    // 당신의 정의들 ...
}
```

## 여러 모듈 사용하기

컴포넌트가 반드시 같은 모듈에 있을 필요는 없습니다. 모듈은 정의를 구성하는 데 도움이 되는 논리적인 공간이며, 다른 모듈의 정의에 의존할 수 있습니다. 정의는 지연(lazy)되며, 컴포넌트가 요청할 때만 해결됩니다.

별도의 모듈에 연결된 컴포넌트의 예시를 들어보겠습니다:

```kotlin
// ComponentB <- ComponentA
class ComponentA()
class ComponentB(val componentA : ComponentA)

val moduleA = module {
    // ComponentA 싱글톤
    single { ComponentA() }
}

val moduleB = module {
    // ComponentA 인스턴스와 연결된 ComponentB 싱글톤
    single { ComponentB(get()) }
}
```

:::info
Koin은 import 개념이 없습니다. Koin 정의는 지연(lazy)됩니다. Koin 정의는 Koin 컨테이너와 함께 시작되지만, 인스턴스화되지는 않습니다. 인스턴스는 해당 타입에 대한 요청이 이루어졌을 때만 생성됩니다.
:::

Koin 컨테이너를 시작할 때 사용될 모듈 목록을 선언하기만 하면 됩니다:

```kotlin
// moduleA와 moduleB로 Koin 시작
startKoin {
    modules(moduleA,moduleB)
}
```

그러면 Koin은 주어진 모든 모듈에서 의존성을 해결할 것입니다.

## 정의 또는 모듈 재정의 (3.1.0 이상)

새로운 Koin 재정의(override) 전략은 기본적으로 모든 정의를 재정의할 수 있도록 합니다. 더 이상 모듈에서 `override = true`를 지정할 필요가 없습니다.

서로 다른 모듈에 동일한 매핑을 가진 두 개의 정의가 있는 경우, 마지막 정의가 현재 정의를 재정의합니다.

```kotlin
val myModuleA = module {
    single<Service> { ServiceImp() }
}
val myModuleB = module {
    single<Service> { TestServiceImp() }
}

startKoin {
    // TestServiceImp가 ServiceImp 정의를 재정의합니다
    modules(myModuleA,myModuleB)
}
```

Koin 로그에서 정의 매핑 재정의에 대해 확인할 수 있습니다.

Koin 애플리케이션 설정에서 `allowOverride(false)`를 사용하여 재정의를 허용하지 않도록 지정할 수 있습니다:

```kotlin
startKoin {
    // 정의 재정의 금지
    allowOverride(false)
}
```

재정의를 비활성화하는 경우, Koin은 재정의 시도 시 `DefinitionOverrideException` 예외를 발생시킵니다.

## 모듈 공유하기

`module { }` 함수를 사용할 때 Koin은 모든 인스턴스 팩토리를 미리 할당합니다. 모듈을 공유해야 하는 경우, 함수를 사용하여 모듈을 반환하는 것을 고려하십시오.

```kotlin
fun sharedModule() = module {
    // 당신의 정의들 ...
}
```

이렇게 하면 정의를 공유하고 값에 팩토리를 미리 할당하는 것을 방지할 수 있습니다.

## 정의 또는 모듈 재정의 (3.1.0 이전)

Koin은 이미 존재하는 정의(타입, 이름, 경로 등)를 재정의하는 것을 허용하지 않습니다. 이를 시도하면 오류가 발생합니다:

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    single<Service> { TestServiceImp() }
}

// BeanOverrideException을 발생시킵니다
startKoin {
    modules(myModuleA,myModuleB)
}
```

정의 재정의를 허용하려면 `override` 매개변수를 사용해야 합니다:

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    // 이 정의에 대한 재정의
    single<Service>(override=true) { TestServiceImp() }
}
```

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

// 모듈의 모든 정의에 대한 재정의 허용
val myModuleB = module(override=true) {

    single<Service> { TestServiceImp() }
}
```

:::note
모듈을 나열하고 정의를 재정의할 때 순서가 중요합니다. 재정의하는 정의는 모듈 목록의 마지막에 있어야 합니다.
:::

## 모듈 연결 전략

*모듈 간 정의는 지연(lazy)되므로*, 모듈을 사용하여 다양한 전략 구현을 할 수 있습니다: 즉, 모듈별로 구현을 선언할 수 있습니다.

Repository와 Datasource의 예를 들어보겠습니다. Repository는 Datasource를 필요로 하며, Datasource는 Local 또는 Remote의 두 가지 방식으로 구현될 수 있습니다.

```kotlin
class Repository(val datasource : Datasource)
interface Datasource
class LocalDatasource() : Datasource
class RemoteDatasource() : Datasource
```

이 컴포넌트들을 3개의 모듈에 선언할 수 있습니다: Repository 모듈과 각 Datasource 구현별 모듈.

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

그런 다음 올바른 모듈 조합으로 Koin을 시작하기만 하면 됩니다:

```kotlin
// Repository + 로컬 Datasource 정의 로드
startKoin {
    modules(repositoryModule,localDatasourceModule)
}

// Repository + 원격 Datasource 정의 로드
startKoin {
    modules(repositoryModule,remoteDatasourceModule)
}
```

## 모듈 포함(Includes) (3.2부터)

`Module` 클래스에 새로운 함수 `includes()`가 추가되었으며, 이를 통해 다른 모듈을 조직적이고 구조화된 방식으로 포함하여 모듈을 구성할 수 있습니다.

이 새로운 기능의 두 가지 주요 사용 사례는 다음과 같습니다:
- 대규모 모듈을 더 작고 집중적인 모듈로 분할합니다.
- 모듈화된 프로젝트에서 모듈 가시성(visibility)에 대한 더 세밀한 제어를 가능하게 합니다(아래 예시 참조).

어떻게 작동할까요? 몇 가지 모듈을 사용하고, `parentModule`에 모듈을 포함하는 예시를 살펴보겠습니다:

```kotlin
// `:feature` 모듈
val childModule1 = module {
    /* 여기에 다른 정의들. */
}
val childModule2 = module {
    /* 여기에 다른 정의들. */
}
val parentModule = module {
    includes(childModule1, childModule2)
}

// `:app` 모듈
startKoin { modules(parentModule) }
```

모든 모듈을 명시적으로 설정할 필요가 없다는 점에 주목하십시오: `parentModule`을 포함함으로써 `includes`에 선언된 모든 모듈(`childModule1` 및 `childModule2`)이 자동으로 로드됩니다. 즉, Koin은 사실상 `parentModule`, `childModule1`, `childModule2`를 로드하는 것입니다.

한 가지 중요한 점은 `includes`를 사용하여 `internal` 및 `private` 모듈도 추가할 수 있다는 것입니다. 이는 모듈화된 프로젝트에서 무엇을 노출할지에 대한 유연성을 제공합니다.

:::info
이제 모듈 로딩은 모든 모듈 그래프를 평탄화하고 중복된 모듈 정의를 방지하도록 최적화되었습니다.
:::

마지막으로, 여러 중첩되거나 중복된 모듈을 포함할 수 있으며, Koin은 포함된 모든 모듈을 평탄화하여 중복을 제거합니다:

```kotlin
// :feature 모듈
val dataModule = module {
    /* 여기에 다른 정의들. */
}
val domainModule = module {
    /* 여기에 다른 정의들. */
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

모든 모듈(`dataModule`, `domainModule`, `featureModule1`, `featureModule2`)이 한 번만 포함된다는 점에 주목하십시오.

:::info
같은 파일에서 모듈을 포함할 때 컴파일 문제가 발생하는 경우, 모듈에 `get()` Kotlin 속성 연산자를 사용하거나 각 모듈을 파일로 분리하십시오. https://github.com/InsertKoinIO/koin/issues/1341 해결 방법을 참조하십시오.
:::