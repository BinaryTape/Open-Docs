---
title: "모듈 (Modules)"
---
Koin을 사용하여 모듈에서 정의를 설명합니다. 이 섹션에서는 모듈을 선언, 구성 및 연결하는 방법을 알아봅니다.

## 모듈이란 무엇입니까?

Koin 모듈은 Koin 정의를 모으는 "공간"입니다. `module` 함수로 선언됩니다.

```kotlin
val myModule = module {
    // Your definitions ...
}
```

## 여러 모듈 사용

컴포넌트가 반드시 동일한 모듈에 있을 필요는 없습니다. 모듈은 정의를 구성하는 데 도움이 되는 논리적 공간이며 다른 모듈의 정의에 의존할 수 있습니다. 정의는 lazy(지연) 방식으로 처리되므로 컴포넌트가 요청할 때만 확인됩니다.

별도의 모듈에서 연결된 컴포넌트의 예를 들어 보겠습니다.

```kotlin
// ComponentB <- ComponentA
class ComponentA()
class ComponentB(val componentA : ComponentA)

val moduleA = module {
    // Singleton ComponentA
    single { ComponentA() }
}

val moduleB = module {
    // Singleton ComponentB with linked instance ComponentA
    single { ComponentB(get()) }
}
```

:::info
Koin에는 import 개념이 없습니다. Koin 정의는 lazy(지연) 방식입니다. Koin 정의는 Koin container(컨테이너)로 시작되지만 인스턴스화되지는 않습니다. 인스턴스는 해당 타입에 대한 요청이 완료된 경우에만 생성됩니다.
:::

Koin 컨테이너를 시작할 때 사용된 모듈 목록을 선언하기만 하면 됩니다.

```kotlin
// Start Koin with moduleA & moduleB
startKoin {
    modules(moduleA,moduleB)
}
```

그러면 Koin은 주어진 모든 모듈에서 종속성을 확인합니다.

## 정의 또는 모듈 재정의 (3.1.0+)

새로운 Koin 재정의 전략을 통해 기본적으로 모든 정의를 재정의할 수 있습니다. 더 이상 모듈에서 `override = true`를 지정할 필요가 없습니다.

서로 다른 모듈에 동일한 매핑을 가진 두 개의 정의가 있는 경우 마지막 정의가 현재 정의를 재정의합니다.

```kotlin
val myModuleA = module {
    single<Service> { ServiceImp() }
}
val myModuleB = module {
    single<Service> { TestServiceImp() }
}

startKoin {
    // TestServiceImp will override ServiceImp definition
    modules(myModuleA,myModuleB)
}
```

Koin 로그에서 정의 매핑 재정의에 대해 확인할 수 있습니다.

`allowOverride(false)`를 사용하여 Koin 애플리케이션 구성에서 재정의를 허용하지 않도록 지정할 수 있습니다.

```kotlin
startKoin {
    // Forbid definition override
    allowOverride(false)
}
```

재정의를 비활성화하는 경우 Koin은 재정의 시도 시 `DefinitionOverrideException` 예외를 발생시킵니다.

## 모듈 공유

`module { }` 함수를 사용하면 Koin은 모든 인스턴스 팩토리를 미리 할당합니다. 모듈을 공유해야 하는 경우 함수를 사용하여 모듈을 반환하는 것을 고려하십시오.

```kotlin
fun sharedModule() = module {
    // Your definitions ...
}
```

이러한 방식으로 정의를 공유하고 값에서 팩토리를 미리 할당하지 않도록 할 수 있습니다.

## 정의 또는 모듈 재정의 (3.1.0 이전)

Koin은 이미 존재하는 정의(타입, 이름, 경로 등)를 재정의하는 것을 허용하지 않습니다. 이 작업을 시도하면 오류가 발생합니다.

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    single<Service> { TestServiceImp() }
}

// Will throw an BeanOverrideException
startKoin {
    modules(myModuleA,myModuleB)
}
```

정의 재정의를 허용하려면 `override` 파라미터를 사용해야 합니다.

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    // override for this definition
    single<Service>(override=true) { TestServiceImp() }
}
```

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

// Allow override for all definitions from module
val myModuleB = module(override=true) {

    single<Service> { TestServiceImp() }
}
```

:::note
 모듈을 나열하고 정의를 재정의할 때는 순서가 중요합니다. 모듈 목록의 마지막에 재정의 정의가 있어야 합니다.
:::

## 모듈 연결 전략

*모듈 간의 정의는 lazy(지연) 방식이므로*, 모듈을 사용하여 다양한 전략 구현을 구현할 수 있습니다. 모듈별로 구현을 선언합니다.

Repository(저장소)와 Datasource(데이터 소스)의 예를 들어 보겠습니다. 저장소에는 데이터 소스가 필요하며 데이터 소스는 Local(로컬) 또는 Remote(원격)의 두 가지 방식으로 구현할 수 있습니다.

```kotlin
class Repository(val datasource : Datasource)
interface Datasource
class LocalDatasource() : Datasource
class RemoteDatasource() : Datasource
```

이러한 컴포넌트를 3개의 모듈(저장소 및 데이터 소스 구현별로 하나씩)에 선언할 수 있습니다.

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

그런 다음 올바른 모듈 조합으로 Koin을 시작하기만 하면 됩니다.

```kotlin
// Load Repository + Local Datasource definitions
startKoin {
    modules(repositoryModule,localDatasourceModule)
}

// Load Repository + Remote Datasource definitions
startKoin {
    modules(repositoryModule,remoteDatasourceModule)
}
```

## 모듈 Includes (3.2부터)

새로운 함수 `includes()`를 `Module` 클래스에서 사용할 수 있습니다. 이를 통해 체계적이고 구조화된 방식으로 다른 모듈을 포함하여 모듈을 구성할 수 있습니다.

새로운 기능의 두 가지 주요 사용 사례는 다음과 같습니다.
- 큰 모듈을 더 작고 집중적인 모듈로 분할합니다.
- 모듈화된 프로젝트에서 모듈 가시성을 더 세밀하게 제어할 수 있습니다(아래 예 참조).

어떻게 작동합니까? 몇 개의 모듈을 가져와서 `parentModule`에 모듈을 포함합니다.

```kotlin
// `:feature` module
val childModule1 = module {
    /* Other definitions here. */
}
val childModule2 = module {
    /* Other definitions here. */
}
val parentModule = module {
    includes(childModule1, childModule2)
}

// `:app` module
startKoin { modules(parentModule) }
```

모든 모듈을 명시적으로 설정할 필요가 없습니다. `parentModule`을 포함하면 `includes`에 선언된 모든 모듈이 자동으로 로드됩니다(`childModule1` 및 `childModule2`). 즉, Koin은 효과적으로 `parentModule`, `childModule1` 및 `childModule2`를 로드합니다.

관찰해야 할 중요한 세부 사항은 `includes`를 사용하여 `internal` 및 `private` 모듈도 추가할 수 있다는 것입니다. 이를 통해 모듈화된 프로젝트에서 노출할 항목을 유연하게 제어할 수 있습니다.

:::info
모듈 로딩은 이제 모든 모듈 그래프를 평면화하고 모듈의 중복된 정의를 방지하도록 최적화되었습니다.
:::

마지막으로 여러 중첩되거나 중복된 모듈을 포함할 수 있으며 Koin은 중복을 제거하여 포함된 모든 모듈을 평면화합니다.

```kotlin
// :feature module
val dataModule = module {
    /* Other definitions here. */
}
val domainModule = module {
    /* Other definitions here. */
}
val featureModule1 = module {
    includes(domainModule, dataModule)
}
val featureModule2 = module {
    includes(domainModule, dataModule)
}

// `:app` module
startKoin { modules(featureModule1, featureModule2) }
```

모든 모듈은 한 번만 포함됩니다(`dataModule`, `domainModule`, `featureModule1`, `featureModule2`).

:::info
동일한 파일에서 모듈을 포함하는 동안 컴파일 문제가 있는 경우 모듈에서 `get()` Kotlin 속성 연산자를 사용하거나 각 모듈을 파일로 분리하십시오. https://github.com/InsertKoinIO/koin/issues/1341 해결 방법 참조
:::