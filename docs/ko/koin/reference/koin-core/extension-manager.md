---
title: 확장 관리자
---

`KoinExtension` 관리자에 대한 간략한 설명입니다. 이 관리자는 Koin 프레임워크 내부에 새로운 기능을 추가하는 데 사용됩니다.

## 확장 정의하기

Koin 확장은 `KoinExtension` 인터페이스를 상속하는 클래스로 구성됩니다.

```kotlin
interface KoinExtension {

    fun onRegister(koin : Koin)

    fun onClose()
}
```

이 인터페이스를 통해 `Koin` 인스턴스가 전달되도록 보장하며, Koin이 종료될 때 확장이 호출됩니다.

## 확장 시작하기

확장을 시작하려면 시스템의 적절한 위치에 연결하고 `Koin.extensionManager`를 사용하여 등록하기만 하면 됩니다.

아래는 `coroutinesEngine` 확장을 정의하는 방법입니다.

```kotlin
fun KoinApplication.coroutinesEngine() {
    with(koin.extensionManager) {
        if (getExtensionOrNull<KoinCoroutinesEngine>(EXTENSION_NAME) == null) {
            registerExtension(EXTENSION_NAME, KoinCoroutinesEngine())
        }
    }
}
```

아래는 `coroutinesEngine` 확장을 호출하는 방법입니다.

```kotlin
val Koin.coroutinesEngine: KoinCoroutinesEngine get() = extensionManager.getExtension(EXTENSION_NAME)
```

## Resolver Engine 및 Resolution Extension

Koin의 해석(resolution) 알고리즘은 플러그형(pluggable) 및 확장 가능하도록 재작업되었습니다. 새로운 `CoreResolver` 및 `ResolutionExtension` API를 통해 외부 시스템 또는 사용자 정의 해석 로직과 통합할 수 있습니다.

내부적으로, 해석은 이제 스택 요소를 더 효율적으로 탐색하며, 스코프(scopes) 및 부모 계층(parent hierarchies) 간에 더 깔끔한 전파(propagation)를 제공합니다. 이는 연결된 스코프 탐색과 관련된 많은 문제를 해결하고 다른 시스템에 Koin을 더 잘 통합할 수 있도록 허용할 것입니다.

아래는 해석 확장(resolution extension)을 보여주는 테스트입니다.

```kotlin
@Test
fun extend_resolution_test(){
    val resolutionExtension = object : ResolutionExtension {
        val instanceMap = mapOf<KClass<*>, Any>(
            Simple.ComponentA::class to Simple.ComponentA()
        )

        override val name: String = "hello-extension"
        override fun resolve(
            scope: Scope,
            instanceContext: ResolutionContext
        ): Any? {
            return instanceMap[instanceContext.clazz]
        }
    }

    val koin = koinApplication{
        printLogger(Level.DEBUG)
        koin.resolver.addResolutionExtension(resolutionExtension)
        modules(module {
            single { Simple.ComponentB(get())}
        })
    }.koin

    assertEquals(resolutionExtension.instanceMap[Simple.ComponentA::class], koin.get<Simple.ComponentB>().a)
    assertEquals(1,koin.instanceRegistry.instances.values.size)
}
```