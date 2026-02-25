[//]: # (title: ライフサイクル)

Compose Multiplatformにおけるコンポーネントのライフサイクルは、Jetpack Composeの[ライフサイクル](https://developer.android.com/topic/libraries/architecture/lifecycle)の概念を採用しています。
ライフサイクルを認識するコンポーネントは、他のコンポーネントのライフサイクル状態の変化に反応することができ、より整理され、多くの場合軽量で、メンテナンスが容易なコードを作成するのに役立ちます。

Compose Multiplatformは共通の `LifecycleOwner` 実装を提供します。これは、オリジナルの Jetpack Compose の機能を他のプラットフォームに拡張し、共通コードでライフサイクル状態を監視するのに役立ちます。

マルチプラットフォームの `Lifecycle` 実装を使用するには、`commonMain` ソースセットに以下の依存関係を追加します。

```kotlin
kotlin {
    // ...
    sourceSets {
        // ...
        commonMain.dependencies {
            // ...
            implementation("org.jetbrains.androidx.lifecycle:lifecycle-runtime-compose:%org.jetbrains.androidx.lifecycle%")
        }
        // ...
    }
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="org.jetbrains.androidx.lifecycle:lifecycle-runtime-compose:%org.jetbrains.androidx.lifecycle%"}

> マルチプラットフォームの Lifecycle 実装の変更は、[What's new](https://www.jetbrains.com/help/kotlin-multiplatform-dev/whats-new-compose.html) で確認するか、[Compose Multiplatform の変更履歴](https://github.com/JetBrains/compose-multiplatform/blob/master/CHANGELOG.md) で特定の EAP リリースを追跡できます。
>
{style="tip"}

## 状態とイベント

ライフサイクルの状態とイベントのフロー（[Jetpack のライフサイクル](https://developer.android.com/topic/libraries/architecture/lifecycle)と同じです）：

![ライフサイクルの図](lifecycle-states.svg){width="700"}

## ライフサイクルの実装

通常、コンポーザブルに固有のライフサイクルは必要ありません。共通の `LifecycleOwner` が、相互に関連するすべてのエンティティにライフサイクルを提供します。デフォルトでは、Compose Multiplatform によって作成されたすべてのコンポーザブルは同じライフサイクルを共有します。これにより、イベントをサブスクライブしたり、ライフサイクル状態を参照したりすることができます。

> `LifecycleOwner` オブジェクトは [CompositionLocal](https://developer.android.com/reference/kotlin/androidx/compose/runtime/CompositionLocal) として提供されます。
> 特定のコンポーザブルのサブツリーに対して個別にライフサイクルを管理したい場合は、[独自に](https://developer.android.com/topic/libraries/architecture/lifecycle#implementing-lco) `LifecycleOwner` 実装を作成できます。
>
{style="tip"}

マルチプラットフォームのライフサイクルでコルーチンを扱う場合、`Lifecycle.coroutineScope` の値が `Dispatchers.Main.immediate` の値に紐付けられていることに注意してください。これは、デスクトップターゲットではデフォルトで使用できない場合があります。
ライフサイクル内のコルーチンや Flow を Compose Multiplatform で正しく動作させるには、プロジェクトに `kotlinx-coroutines-swing` の依存関係を追加してください。
詳細は [`Dispatchers.Main` のドキュメント](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines/-dispatchers/-main.html)を参照してください。

* ナビゲーションコンポーネントでのライフサイクルの仕組みについては、[ナビゲーションとルーティング](compose-navigation-routing.md)で確認してください。
* マルチプラットフォームの ViewModel 実装の詳細については、[共通 ViewModel](compose-viewmodel.md) ページを参照してください。

## Android ライフサイクルの他プラットフォームへのマッピング

### iOS

| ネイティブのイベントと通知                      | ライフサイクルイベント | ライフサイクル状態の変化      |
|-----------------------------------------|-----------------|-------------------------|
| `viewDidDisappear`                      | `ON_STOP`       | `STARTED` → `CREATED`   |
| `viewWillAppear`                        | `ON_START`      | `CREATED` → `STARTED`   |
| `willResignActive`                      | `ON_PAUSE`      | `RESUMED` → `STARTED`   |
| `didBecomeActive`                       | `ON_RESUME`     | `STARTED` → `RESUMED`   |
| `didEnterBackground`                    | `ON_STOP`       | `STARTED` → `CREATED`   |
| `willEnterForeground`                   | `ON_START`      | `CREATED` → `STARTED`   |
| `viewControllerDidLeaveWindowHierarchy` | `ON_DESTROY`    | `CREATED` → `DESTROYED` |

### Web

Wasm ターゲットの制限により、ライフサイクルは以下のようになります：

* アプリケーションは常にページにアタッチされているため、`CREATED` 状態をスキップします。
* Web ページは通常、ユーザーがタブを閉じたときにのみ終了するため、`DESTROYED` 状態には到達しません。

| ネイティブイベント                                | ライフサイクルイベント | ライフサイクル状態の変化   |
|------------------------------------------|-----------------|------------------------|
| `visibilitychange` (表示状態になる)        | `ON_START`      | `CREATED` → `STARTED`  |
| `focus`                                  | `ON_RESUME`     | `STARTED` → `RESUMED`  |
| `blur`                                   | `ON_PAUSE`      | `RESUMED` → `STARTED`  |
| `visibilitychange` (非表示状態になる)      | `ON_STOP`       | `STARTED` → `CREATED`  |

### デスクトップ

| Swing リスナーのコールバック | ライフサイクルイベント | ライフサイクル状態の変化      |
|--------------------------|-----------------|-------------------------|
| `windowIconified`        | `ON_STOP`       | `STARTED` → `CREATED`   |
| `windowDeiconified`      | `ON_START`      | `CREATED` → `STARTED`   |
| `windowLostFocus`        | `ON_PAUSE`      | `RESUMED` → `STARTED`   |
| `windowGainedFocus`      | `ON_RESUME`     | `STARTED` → `RESUMED`   |
| `dispose`                | `ON_DESTROY`    | `CREATED` → `DESTROYED` |