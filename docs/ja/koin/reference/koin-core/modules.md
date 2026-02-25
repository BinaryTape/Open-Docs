---
title: モジュール
---

Koinを使用すると、モジュール内で定義を記述します。このセクションでは、モジュールの宣言、整理、およびリンク方法について説明します。

## モジュールとは何か？

Koinモジュールは、Koinの定義を集めるための「スペース」です。これは `module` 関数を使って宣言されます。

```kotlin
val myModule = module {
    // 定義をここに記述 ...
}
```

## 複数のモジュールを使用する

コンポーネントは必ずしも同じモジュール内にある必要はありません。モジュールは定義を整理するための論理的なスペースであり、他のモジュールの定義に依存することもできます。定義はレイジー（lazy）であり、コンポーネントがそれらを要求したときにのみ解決されます。

別のモジュールにあるリンクされたコンポーネントの例を見てみましょう：

```kotlin
// ComponentB <- ComponentA
class ComponentA()
class ComponentB(val componentA : ComponentA)

val moduleA = module {
    // シングルトン ComponentA
    single { ComponentA() }
}

val moduleB = module {
    // インスタンス ComponentA がリンクされたシングルトン ComponentB
    single { ComponentB(get()) }
}
```

:::info 
Koinにはインポート（import）という概念はありません。Koinの定義はレイジーです。Koinの定義はKoinコンテナとともに開始されますが、インスタンス化はされません。インスタンスは、その型のリクエストが行われたときにのみ作成されます。
:::

Koinコンテナを起動するときに、使用するモジュールのリストを宣言するだけです：

```kotlin
// moduleA と moduleB を指定して Koin を起動
startKoin {
    modules(moduleA,moduleB)
}
```

Koinは、提供されたすべてのモジュールから依存関係を解決します。

## 定義またはモジュールのオーバーライド (3.1.0+)

Koinの新しいオーバーライド戦略では、デフォルトですべての定義をオーバーライドできるようになりました。モジュール内で `override = true` を指定する必要はもうありません。

異なるモジュールに同じマッピングを持つ2つの定義がある場合、最後に読み込まれたものが現在の定義をオーバーライドします。

```kotlin
val myModuleA = module {
    single<Service> { ServiceImp() }
}
val myModuleB = module {
    single<Service> { TestServiceImp() }
}

startKoin {
    // TestServiceImp が ServiceImp の定義をオーバーライドします
    modules(myModuleA,myModuleB)
}
```

定義マッピングのオーバーライドについては、Koinのログで確認できます。

`allowOverride(false)` を使用して、Koinアプリケーションの設定でオーバーライドを許可しないように指定することもできます：

```kotlin
startKoin {
    // 定義のオーバーライドを禁止する
    allowOverride(false)
}
```

オーバーライドを無効にした場合、オーバーライドの試みに対して Koin は `DefinitionOverrideException` 例外をスローします。

## モジュールの共有

`module { }` 関数を使用すると、Koinはすべてのインスタンスファクトリを事前割り当て（preallocate）します。モジュールを共有する必要がある場合は、関数でモジュールを返すことを検討してください。

```kotlin
fun sharedModule() = module {
    // 定義をここに記述 ...
}
```

これにより、定義を共有し、値（変数）としてのファクトリの事前割り当てを避けることができます。

## 定義またはモジュールのオーバーライド (3.1.0 未満)

Koinは、既存の定義（型、名前、パスなど）を再定義することを許可しません。これを試みるとエラーが発生します：

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    single<Service> { TestServiceImp() }
}

// BeanOverrideException をスローします
startKoin {
    modules(myModuleA,myModuleB)
}
```

定義のオーバーライドを許可するには、`override` パラメータを使用する必要があります：

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

val myModuleB = module {

    // この定義をオーバーライドする
    single<Service>(override=true) { TestServiceImp() }
}
```

```kotlin
val myModuleA = module {

    single<Service> { ServiceImp() }
}

// モジュール内のすべての定義に対してオーバーライドを許可する
val myModuleB = module(override=true) {

    single<Service> { TestServiceImp() }
}
```

:::note
 モジュールのリスト作成や定義のオーバーライドの際には、順序が重要です。オーバーライドする定義を含むモジュールは、モジュールリストの最後に配置する必要があります。
:::

## モジュールのリンク戦略

*モジュール間の定義はレイジーであるため*、モジュールを使用して異なる戦略の実装を実現できます。つまり、モジュールごとに実装を宣言します。

`Repository` と `Datasource` の例を見てみましょう。`Repository` は `Datasource` を必要とし、`Datasource` は `Local` または `Remote` の2つの方法で実装できます。

```kotlin
class Repository(val datasource : Datasource)
interface Datasource
class LocalDatasource() : Datasource
class RemoteDatasource() : Datasource
```

これらのコンポーネントを3つのモジュール（`Repository` 用に1つ、`Datasource` の実装ごとに1つずつ）に宣言できます：

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

あとは、適切なモジュールの組み合わせで Koin を起動するだけです：

```kotlin
// Repository + Local Datasource の定義をロード
startKoin {
    modules(repositoryModule,localDatasourceModule)
}

// Repository + Remote Datasource の定義をロード
startKoin {
    modules(repositoryModule,remoteDatasourceModule)
}
```

## モジュールのインクルード (3.2 以降)

`Module` クラスで新しい関数 `includes()` が利用可能になりました。これにより、他のモジュールを整理された構造的な方法で含めることで、モジュールを構成できます。

この新機能の主なユースケースは次の2つです：
- 大きなモジュールを、より小さく、特定の目的に特化したモジュールに分割する。
- モジュール化されたプロジェクトにおいて、モジュールの可視性をより細かく制御できるようにする（以下の例を参照）。

どのように機能するのでしょうか？いくつかのモジュールを用意し、それらを `parentModule` に含めてみます：

```kotlin
// `:feature` モジュール
val childModule1 = module {
    /* ここに他の定義 */
}
val childModule2 = module {
    /* ここに他の定義 */
}
val parentModule = module {
    includes(childModule1, childModule2)
}

// `:app` モジュール
startKoin { modules(parentModule) }
```

すべてのモジュールを明示的に設定する必要はないことに注目してください。`parentModule` を含めることで、`includes` で宣言されたすべてのモジュール（`childModule1` と `childModule2`）が自動的にロードされます。言い換えれば、Koinは実質的に `parentModule`、`childModule1`、`childModule2` をロードしています。

注目すべき重要な点は、`includes` を使用して `internal` や `private` モジュールも追加できることです。これにより、モジュール化されたプロジェクトで何を公開するかについて柔軟性が得られます。

:::info
モジュールのロードが最適化され、すべてのモジュールグラフがフラット化（平坦化）され、モジュールの重複定義が回避されるようになりました。
:::

最後に、複数のネストされたモジュールや重複したモジュールを含めることができ、Koinは含まれるすべてのモジュールをフラット化して重複を削除します：

```kotlin
// :feature モジュール
val dataModule = module {
    /* ここに他の定義 */
}
val domainModule = module {
    /* ここに他の定義 */
}
val featureModule1 = module {
    includes(domainModule, dataModule)
}
val featureModule2 = module {
    includes(domainModule, dataModule)
}

// `:app` モジュール
startKoin { modules(featureModule1, featureModule2) }
```

すべてのモジュールが一度だけ含まれることに注目してください： `dataModule`, `domainModule`, `featureModule1`, `featureModule2`。

:::info
同じファイルからモジュールをインクルードする際にコンパイルの問題が発生した場合は、モジュールに対して Kotlin の属性オペレータである `get()` を使用するか、各モジュールを別々のファイルに分けてください。詳細は https://github.com/InsertKoinIO/koin/issues/1341 の回避策を参照してください。
:::