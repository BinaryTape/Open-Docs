---
title: 익스텐션 매니저 (Extension Manager)
---

Koin 프레임워크 내부에 새로운 기능을 추가하기 위해 설계된 `KoinExtension` 매니저에 대한 간략한 설명입니다.

## 익스텐션 정의하기

Koin 익스텐션은 `KoinExtension` 인터페이스를 상속받는 클래스를 만드는 것으로 정의됩니다.

```kotlin
interface KoinExtension {

    fun onRegister(koin : Koin)

    fun onClose()
}
```

이 인터페이스를 통해 `Koin` 인스턴스를 전달받을 수 있으며, Koin이 종료될 때 해당 익스텐션이 호출되도록 보장합니다.

## 익스텐션 시작하기

익스텐션을 시작하려면 시스템의 적절한 위치를 확장하고 `Koin.extensionManager`에 등록하면 됩니다.

아래는 `coroutinesEngine` 익스텐션을 정의하는 방법입니다:

```kotlin
fun KoinApplication.coroutinesEngine() {
    with(koin.extensionManager) {
        if (getExtensionOrNull<KoinCoroutinesEngine>(EXTENSION_NAME) == null) {
            registerExtension(EXTENSION_NAME, KoinCoroutinesEngine())
        }
    }
}
```

아래는 `coroutinesEngine` 익스텐션을 호출하는 방법입니다:

```kotlin
val Koin.coroutinesEngine: KoinCoroutinesEngine get() = extensionManager.getExtension(EXTENSION_NAME)
```

## 리졸버 엔진(Resolver Engine) 및 리졸루션 익스텐션(Resolution Extension)

Koin의 리졸루션(resolution, 의존성 해결) 알고리즘은 플러그형(pluggable) 및 확장 가능하도록 재설계되었습니다. 새로운 `CoreResolver` 및 `ResolutionExtension` API를 통해 외부 시스템 또는 커스텀 리졸루션 로직과 통합할 수 있습니다.

내부적으로 리졸루션은 이제 스택 요소를 더 효율적으로 탐색하며, 스코프와 부모 계층 구조 전반에 걸쳐 더 깔끔하게 전파됩니다. 이를 통해 연결된 스코프 순회(linked scope walk-through)와 관련된 많은 이슈를 해결하고, 다른 시스템에서 Koin을 더 효과적으로 통합할 수 있게 해줍니다.

아래는 리졸루션 익스텐션을 시연하는 테스트 코드입니다:

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