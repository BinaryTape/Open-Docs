[//]: # (title: アクセシビリティ)

Compose Multiplatformは、セマンティックプロパティ、アクセシビリティAPI、およびスクリーンリーダーやキーボードナビゲーションを含む支援技術へのサポートなど、アクセシビリティ基準を満たすために不可欠な機能を提供します。

このフレームワークにより、[欧州アクセシビリティ法](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32019L0882) (EAA) および [Web Content Accessibility Guidelines](https://www.w3.org/TR/WCAG21/) (WCAG) の要件に準拠したアプリケーションを設計できます。

## セマンティックプロパティ

アクセシビリティ、オートフィル、テストなどのサービスにコンテキストを提供するために、セマンティックプロパティを使用してコンポーネントの意味と役割を定義できます。

セマンティックプロパティは、UIを簡略化した表現であるセマンティックツリーの構成要素です。コンポーザブルでセマンティックプロパティを定義すると、それらは自動的にセマンティックツリーに追加されます。支援技術は、UIツリー全体ではなく、セマンティックツリーをトラバース（巡回）することでアプリと対話します。

アクセシビリティのための主要なセマンティックプロパティ：

* `contentDescription` は、[`IconButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-icon-button.html) や [`FloatingActionButton`](https://kotlinlang.org/api/compose-multiplatform/material3/androidx.compose.material3/-floating-action-button.html) のような、非テキスト要素や曖昧なUI要素に対して説明を提供します。これは主要なアクセシビリティAPIであり、スクリーンリーダーが読み上げるテキストラベルを提供するために使用されます。

  ```kotlin
  Modifier.semantics { contentDescription = "画像の記述" }
  ```

* `role` は、アクセシビリティサービスに対して、ボタン、チェックボックス、画像といったUIコンポーネントの機能的な型を通知します。これにより、スクリーンリーダーがインタラクションモデルを解釈し、要素を適切にアナウンスするのに役立ちます。

  ```kotlin
  Modifier.semantics { role = Role.Button }
  ```

* `stateDescription` は、対話型のUI要素の現在の状態を説明します。

  ```kotlin
  Modifier.semantics { stateDescription = if (isChecked) "Checked" else "Unchecked" }
  ```

* `testTag` は、Android上の Espresso フレームワークや iOS上の XCUITest によるUIテストのために、コンポーザブルな要素に一意の識別子を割り当てます。また、デバッグや、コンポーネント識別子が必要な特定の自動化シナリオで `testTag` を使用することもできます。

  ```kotlin
  Modifier.testTag("my_unique_element_id")
  ```

セマンティックプロパティの完全なリストについては、[`SemanticsProperties`](https://developer.android.com/reference/kotlin/androidx/compose/ui/semantics/SemanticsProperties) の Jetpack Compose API リファレンスを参照してください。

## トラバース順序

デフォルトでは、スクリーンリーダーは左から右、上から下へとレイアウトに従って、固定された順序でUI要素をナビゲートします。しかし、複雑なレイアウトの場合、スクリーンリーダーが正しい読み上げ順序を自動的に判断できないことがあります。これは、含まれるビューのスクロールやズームをサポートするテーブルやネストされたビューなどのコンテナビューを持つレイアウトにおいて極めて重要です。

複雑なビューをスクロールしたりスワイプしたりする際に正しい読み上げ順序を確保するには、トラバース（traversal）セマンティックプロパティを定義します。これにより、上スワイプまたは下スワイプのアクセシビリティジェスチャーを使用した、異なるトラバースグループ間の正しいナビゲーションも保証されます。

コンポーネントのトラバースインデックスのデフォルト値は `0f` です。コンポーネントのトラバースインデックスの値が小さいほど、他のコンポーネントと比較してそのコンテンツの説明が早く読み上げられます。

例えば、スクリーンリーダーにフローティングアクションボタンを優先させたい場合は、そのトラバースインデックスを `-1f` に設定できます。

```kotlin
@Composable
fun FloatingBox() {
    Box(
        modifier =
        Modifier.semantics {
            isTraversalGroup = true
            // デフォルトのインデックスを持つ要素よりも優先させるために、負のインデックスを設定します
            traversalIndex = -1f
        }
    ) {
        FloatingActionButton(onClick = {}) {
            Icon(
                imageVector = Icons.Default.Add,
                contentDescription = "フローティングアクションボタンのアイコン"
            )
        }
    }
}
```

## 次のステップ

iOS向けのアクセシビリティ機能について詳しく学ぶ：

* [ハイコントラストテーマ](compose-ios-accessibility.md#high-contrast-theme)
* [XCTestフレームワークによるアクセシビリティのテスト](compose-ios-accessibility.md#test-accessibility-with-xctest-framework)
* [トラックパッドとキーボードによる操作](compose-ios-accessibility.md#control-via-trackpad-and-keyboard)
* [セマンティックツリーとiOSアクセシビリティツリーの同期](compose-ios-accessibility.md#choose-the-tree-synchronization-option) (Compose Multiplatform 1.7.3 以前の場合)

デスクトップ向けのアクセシビリティ機能について詳しく学ぶ：

* [Windowsでのアクセシビリティの有効化](compose-desktop-accessibility.md#enabling-accessibility-on-windows)
* [macOSおよびWindowsのツールを使用したアプリのテスト](compose-desktop-accessibility.md#example-custom-button-with-semantic-rules)

実装の詳細については、[Jetpack Compose のドキュメント](https://developer.android.com/develop/ui/compose/accessibility)を参照してください。