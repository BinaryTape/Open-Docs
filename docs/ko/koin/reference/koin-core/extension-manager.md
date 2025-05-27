---
title: 확장 관리자
---

`KoinExtension` 관리자에 대한 간략한 설명입니다. 이 관리자는 Koin 프레임워크 내부에 새로운 기능을 추가하는 데 사용됩니다.

## 확장 정의하기

Koin 확장은 `KoinExtension` 인터페이스를 상속하는 클래스로 구성됩니다.

```kotlin
interface KoinExtension {
    
    var koin : Koin
    
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