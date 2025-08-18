---
title: 拡張機能マネージャー
---

`KoinExtension`マネージャーの簡単な説明です。これはKoinフレームワーク内に新機能を追加するために特化しています。

## 拡張機能の定義

Koin拡張機能は、`KoinExtension`インターフェースを継承するクラスを持つことによって構成されます。

```kotlin
interface KoinExtension {

    fun onRegister(koin : Koin)

    fun onClose()
}
```

このインターフェースは、`Koin`インスタンスが渡されること、そしてKoinがクローズする際に拡張機能が呼び出されることを保証します。

## 拡張機能の開始

拡張機能を開始するには、システムの適切な場所を拡張し、`Koin.extensionManager`で登録するだけです。

以下に、`coroutinesEngine`拡張機能を定義する方法を示します。

```kotlin
fun KoinApplication.coroutinesEngine() {
    with(koin.extensionManager) {
        if (getExtensionOrNull<KoinCoroutinesEngine>(EXTENSION_NAME) == null) {
            registerExtension(EXTENSION_NAME, KoinCoroutinesEngine())
        }
    }
}
```

以下に、`coroutinesEngine`拡張機能の呼び出し方法を示します。

```kotlin
val Koin.coroutinesEngine: KoinCoroutinesEngine get() = extensionManager.getExtension(EXTENSION_NAME)
```

## リゾルバーエンジンと解決拡張機能

Koinの解決アルゴリズムは、プラグイン可能で拡張できるように再設計されました。新しいCoreResolverとResolutionExtension APIは、外部システムまたはカスタムの解決ロジックとの統合を可能にします。

内部的に、解決はスタック要素をより効率的に走査するようになり、スコープや親階層にわたるよりクリーンな伝播を伴います。これにより、リンクされたスコープのウォークスルーに関連する多くの問題が修正され、他のシステムへのKoinのより良い統合が可能になります。

以下に、解決拡張機能をデモするテストを示します。

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