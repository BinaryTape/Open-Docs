---
title: Androidにおける複数のKoinモジュール
---
Koin を使用すると、モジュール内で定義を記述できます。このセクションでは、モジュールを宣言、構成、およびリンクする方法について説明します。

## 複数のモジュールの使用

コンポーネントは必ずしも同じモジュール内にある必要はありません。モジュールは、定義を整理するのに役立つ論理的なスペースであり、別のモジュールの定義に依存できます。定義は遅延評価され (lazy)、コンポーネントが要求したときにのみ解決されます。

別のモジュール内のリンクされたコンポーネントの例を見てみましょう。

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

Koin コンテナを開始するときに、使用するモジュールのリストを宣言するだけです。

```kotlin
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // ...

            // モジュールのロード
            modules(moduleA, moduleB)
        }
        
    }
}
```

Gradle モジュールごとに自己組織化し、複数の Koin モジュールを収集するのはあなた次第です。

> 詳細については、[Koin モジュール セクション](/reference/koin-core/modules.md) を確認してください

## モジュールインクルード (Module Includes) (3.2 以降)

`includes()` という新しい関数が `Module` クラスで使用できるようになりました。これにより、他のモジュールを構造化された方法でインクルードして、モジュールを構成できます。

この新機能の主なユースケースは次の 2 つです。
- 大きなモジュールをより小さく、より焦点を絞ったモジュールに分割します。
- モジュール化されたプロジェクトでは、モジュールの可視性をより細かく制御できます (以下の例を参照)。

どのように機能するか? いくつかのモジュールを取り上げ、`parentModule` にモジュールを含めます。

```kotlin
// `:feature` モジュール
val childModule1 = module {
    /* その他の定義はこちら. */
}
val childModule2 = module {
    /* その他の定義はこちら. */
}
val parentModule = module {
    includes(childModule1, childModule2)
}

// `:app` モジュール
startKoin { modules(parentModule) }
```

すべてのモジュールを明示的に設定する必要はありません。`parentModule` をインクルードすると、`includes` で宣言されたすべてのモジュールが自動的にロードされます (`childModule1` および `childModule2`)。 言い換えれば、Koin は事実上 `parentModule`、`childModule1`、および `childModule2` をロードしています。

注意すべき重要な詳細は、`includes` を使用して `internal` および `private` モジュールも追加できることです。これにより、モジュール化されたプロジェクトで公開するものを柔軟に制御できます。

:::info
モジュールのロードが最適化され、モジュールグラフがすべて平坦化され、モジュールの重複した定義が回避されるようになりました。
:::

最後に、複数のネストされたモジュールまたは重複したモジュールを含めることができ、Koin はインクルードされたモジュールをすべて平坦化して重複を削除します。

```kotlin
// :feature モジュール
val dataModule = module {
    /* その他の定義はこちら. */
}
val domainModule = module {
    /* その他の定義はこちら. */
}
val featureModule1 = module {
    includes(domainModule, dataModule)
}
val featureModule2 = module {
    includes(domainModule, dataModule)
}
```

```kotlin
// `:app` モジュール
class MainApplication : Application() {

    override fun onCreate() {
        super.onCreate()

        startKoin {
            // ...

            // モジュールのロード
             modules(featureModule1, featureModule2)
        }
        
    }
}
```

すべてのモジュールは 1 回だけインクルードされることに注意してください: `dataModule`、`domainModule`、`featureModule1`、`featureModule2`。

## バックグラウンドモジュールロードによる起動時間の短縮

リソースの事前割り当てをトリガーせず、Koin の起動時にバックグラウンドでロードすることで、Koin モジュールを「遅延 (lazy)」宣言できるようになりました。 これにより、遅延モジュールをバックグラウンドでロードするように渡すことで、Android の起動プロセスがブロックされるのを回避できます。

- `lazyModule` - Koin モジュールの遅延 Kotlin バージョンを宣言します
- `Module.includes` - 遅延モジュールを含めることを許可します
- `KoinApplication.lazyModules` - プラットフォームのデフォルトの Dispatchers に関係なく、コルーチンを使用してバックグラウンドで遅延モジュールをロードします
- `Koin.waitAllStartJobs` - 開始ジョブが完了するまで待ちます
- `Koin.runOnKoinStarted` - 開始が完了した後にブロックコードを実行します

理解するには、良い例が常に最適です。

```kotlin

// 遅延ロードされたモジュール
val m2 = lazyModule {
    singleOf(::ClassB)
}

val m1 = module {
    singleOf(::ClassA) { bind<IClassA>() }
}

startKoin {
    // 同期モジュールロード
    modules(m1)
    // バックグラウンドで遅延モジュールをロード
    lazyModules(m2)
}

val koin = KoinPlatform.getKoin()

// 開始完了を待つ
koin.waitAllStartJobs()

// または、開始後にコードを実行
koin.runOnKoinStarted { koin ->
    // バックグラウンドロードが完了した後に実行
}
```