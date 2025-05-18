---
title: "확장 프로그램 관리자 (Extension Manager)"
---
다음은 Koin 프레임워크 내부에 새로운 기능을 추가하는 데 사용되는 `KoinExtension` 관리자에 대한 간략한 설명입니다.

## 확장 정의

Koin 확장은 `KoinExtension` 인터페이스를 상속하는 클래스를 갖는 것으로 구성됩니다.

```kotlin
interface KoinExtension {
    
    var koin : Koin
    
    fun onClose()
}
```

이 인터페이스를 통해 `Koin` 인스턴스가 전달되고 Koin이 종료될 때 확장이 호출되는 것을 보장할 수 있습니다.

## 확장 시작

확장을 시작하려면 시스템의 올바른 위치를 확장하고 `Koin.extensionManager`에 등록하면 됩니다.

다음은 `coroutinesEngine` 확장을 정의하는 방법입니다.

```kotlin
fun KoinApplication.coroutinesEngine() {
    with(koin.extensionManager) {
        if (getExtensionOrNull<KoinCoroutinesEngine>(EXTENSION_NAME) == null) {
            registerExtension(EXTENSION_NAME, KoinCoroutinesEngine())
        }
    }
}
```

다음은 `coroutinesEngine` 확장을 호출하는 방법입니다.

```kotlin
val Koin.coroutinesEngine: KoinCoroutinesEngine get() = extensionManager.getExtension(EXTENSION_NAME)
```