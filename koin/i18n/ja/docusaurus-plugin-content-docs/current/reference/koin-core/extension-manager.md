---
title: "Extension Manager (拡張機能マネージャー)"
---
`KoinExtension`マネージャーの簡単な説明です。これは、Koinフレームワーク内に新しい機能を追加するために使用されます。

## 拡張機能の定義

Koin拡張機能は、`KoinExtension`インターフェースを継承するクラスを持つことで構成されます。

```kotlin
interface KoinExtension {
    
    var koin : Koin
    
    fun onClose()
}
```

このインターフェースを使用すると、`Koin`インスタンスが渡されることが保証され、Koinが閉じるときに拡張機能が呼び出されます。

## 拡張機能の開始

拡張機能を開始するには、システムの適切な場所を拡張し、`Koin.extensionManager`に登録します。

以下は、`coroutinesEngine`拡張機能を定義する方法です。

```kotlin
fun KoinApplication.coroutinesEngine() {
    with(koin.extensionManager) {
        if (getExtensionOrNull<KoinCoroutinesEngine>(EXTENSION_NAME) == null) {
            registerExtension(EXTENSION_NAME, KoinCoroutinesEngine())
        }
    }
}
```

以下は、`coroutinesEngine`拡張機能を呼び出す方法です。

```kotlin
val Koin.coroutinesEngine: KoinCoroutinesEngine get() = extensionManager.getExtension(EXTENSION_NAME)
```