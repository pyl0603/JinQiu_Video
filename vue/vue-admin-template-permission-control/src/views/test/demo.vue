<template>
  <div class="hello">
    <div class="team" v-for="(team,tindex) in teamDataArr" :key="tindex">
      <div
        class="member"
        v-for="(item,cindex) in team.children"
        :key="cindex"
        :data-id="tindex+'-'+cindex"
        draggable="true"
        @dragstart="onDragstart($event)"
        @dragend="onDragend($event)"
        @dragover="onDragover($event)"
        @drop="onDrop($event)"
         :class="{on : !item.isMain}"
      >
        <!-- 正向 -->
        <!-- <div class="oneout"> -->
          <div v-for="items in item.mobile" :key="items.id" class="one" >
            <div class="twoout">
              <div v-for="itemss in items.addr" :key="itemss.id" class="two">
                <div class="threeout">
                  <div v-for="itemsss in itemss.aprt" :key="itemsss.id" class="three">
                    <div class="four">
                      <div
                        v-for="itemssss in itemsss.phone"
                        :key="itemssss.phone"
                        class="fourcont"
                      >{{itemssss.name + '第四层'}}</div>
                    </div>
                    <div class="threecont">{{itemsss.name + '第三层'}}</div>
                  </div>
                </div>
                <div class="twocont">{{itemss.name + '第二层'}}</div>
              </div>
            </div>
            <div class="onecont">{{items.name + '第一层'}}</div>
          </div>
        </div>
      </div>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  name: "dragend",
  data() {
    return {
      startExchangeIndex: "",
      endExchangeIndex: "",
      teamDataArr: [
        {
          teamName: "A队",
          children: [
            {
              id: 1,
              name: "aaa",
              isMain: true,
              mobile: [
                {
                  id: 1,
                  name: "aaa",
                  addr: [
                    {
                      id: 2,
                      name: "aaa",
                      aprt: [
                        {
                          id: 2,
                          name: "aaa",
                          phone: [
                            { id: 2, name: "aaa" },
                            { id: 21, name: "aaa" }
                          ]
                        },
                        {
                          id: 21,
                          name: "aaa",
                          phone: [
                            { id: 2, name: "aaa" },
                            { id: 21, name: "aaa" }
                          ]
                        }
                      ]
                    },
                    {
                      id: 21,
                      name: "aaa",
                      aprt: [
                        {
                          id: 2,
                          name: "aaa",
                          phone: [
                            { id: 2, name: "aaa" },
                            { id: 21, name: "aaa" }
                          ]
                        },
                        {
                          id: 21,
                          name: "aaa",
                          phone: [
                            { id: 2, name: "aaa" },
                            { id: 21, name: "aaa" }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              id: 1,
              name: "aaa",
              isMain: false,
              mobile: [
                {
                  id: 1,
                  name: "aaa",
                  addr: [
                    {
                      id: 2,
                      name: "aaa",
                      aprt: [
                        {
                          id: 2,
                          name: "aaa",
                          phone: [
                            { id: 2, name: "aaa" },
                            { id: 21, name: "aaa" }
                          ]
                        },
                        {
                          id: 21,
                          name: "aaa",
                          phone: [
                            { id: 2, name: "aaa" },
                            { id: 21, name: "aaa" }
                          ]
                        }
                      ]
                    },
                    {
                      id: 21,
                      name: "aaa",
                      aprt: [
                        {
                          id: 2,
                          name: "aaa",
                          phone: [
                            { id: 2, name: "aaa" },
                            { id: 21, name: "aaa" }
                          ]
                        },
                        {
                          id: 21,
                          name: "aaa",
                          phone: [
                            { id: 2, name: "aaa" },
                            { id: 21, name: "aaa" }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        
        // {
        //   teamName: "B队",
        //   children: [
        //     {
        //       id: 5,
        //       isMain: false,
        //       name: "eee",
        //       mobile: [
        //         { id: 5, name: "eee", addr: [{ id: 1, name: "aaa" }] },
        //         { id: 51, name: "eee1", addr: [{ id: 1, name: "aaa" }] }
        //       ]
        //     },
        //     {
        //       id: 6,
        //       isMain: false,
        //       name: "fff",
        //       mobile: [
        //         { id: 6, name: "fff", addr: [{ id: 1, name: "aaa" }] },
        //         { id: 61, name: "fff1", addr: [{ id: 1, name: "aaa" }] }
        //       ]
        //     },
        //     {
        //       id: 5,
        //       isMain: false,
        //       name: "eee",
        //       mobile: [
        //         { id: 5, name: "eee", addr: [{ id: 1, name: "aaa" }] },
        //         { id: 51, name: "eee1", addr: [{ id: 1, name: "aaa" }] }
        //       ]
        //     },
        //     {
        //       id: 6,
        //       isMain: false,
        //       name: "fff",
        //       mobile: [
        //         { id: 6, name: "fff", addr: [{ id: 1, name: "aaa" }] },
        //         { id: 61, name: "fff1", addr: [{ id: 1, name: "aaa" }] }
        //       ]
        //     }
        //   ]
        // }
      ]
    };
  },
  methods: {
    onDragstart(event) {
      // event.target 都返回源元素
      this.startExchangeIndex = event.target.getAttribute("data-id");
      console.log("拖拽开始");
    },
    onDragend(event) {
      // event.target 都返回源元素
      console.log(
        "下标" +
          this.startExchangeIndex +
          " 和 " +
          this.endExchangeIndex +
          "进行替换"
      );

      let startTeamIndex = parseInt(this.startExchangeIndex.split("-")[0]);
      let startMemberIndex = parseInt(this.startExchangeIndex.split("-")[1]);
      let endTeamIndex = parseInt(this.endExchangeIndex.split("-")[0]);
      let endMemberIndex = parseInt(this.endExchangeIndex.split("-")[1]);

      let _id = this.teamDataArr[endTeamIndex].children[endMemberIndex].id;
      let _name = this.teamDataArr[endTeamIndex].children[endMemberIndex].name;
      let _isMain = !this.teamDataArr[endTeamIndex].children[endMemberIndex]
        .isMain;
      let _mobile = this.teamDataArr[endTeamIndex].children[endMemberIndex]
        .mobile;

      this.teamDataArr[endTeamIndex].children[
        endMemberIndex
      ].id = this.teamDataArr[startTeamIndex].children[startMemberIndex].id;
      this.teamDataArr[endTeamIndex].children[
        endMemberIndex
      ].name = this.teamDataArr[startTeamIndex].children[startMemberIndex].name;
      this.teamDataArr[endTeamIndex].children[endMemberIndex].isMain = !this
        .teamDataArr[startTeamIndex].children[startMemberIndex].isMain;
      this.teamDataArr[endTeamIndex].children[
        endMemberIndex
      ].mobile = this.teamDataArr[startTeamIndex].children[
        startMemberIndex
      ].mobile;

      this.teamDataArr[startTeamIndex].children[startMemberIndex].id = _id;
      this.teamDataArr[startTeamIndex].children[startMemberIndex].name = _name;
      this.teamDataArr[startTeamIndex].children[
        startMemberIndex
      ].isMain = _isMain;
      this.teamDataArr[startTeamIndex].children[
        startMemberIndex
      ].mobile = _mobile;

      console.log("拖拽结束");
      console.log(this.teamDataArr[0].children[0]);
    },
    onDrop(event) {
      // event.target 都返回目标元素
      if (event.target.className == "member") {
        this.endExchangeIndex = event.target.getAttribute("data-id");
      } else {
        this.endExchangeIndex = event.target.parentElement.getAttribute(
          "data-id"
        );
      }
    },
    onDragover(event) {
      // 阻止元素的默认行为，不然ondrop不管用
      event.preventDefault();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.team {
  width: 100%;
  /* display: flex; */
}
.member {
  width: 100%;
}
.foruout {
  display: flex;
  /* width: 100%; */
}
.one {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: center;
}
.two {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-around;
}
.three {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-around;
}
.four {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  justify-content: space-around;
}
.fourcont {
  width: 50px;
  height: 50px;
  background: yellow;
  margin-left: 10px;
}
.threeout,
.twoout {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.threecont {
  width: 50px;
  height: 50px;
  background: red;
  margin-left: 10px;
  margin-top: 10px;
}
.twocont {
  width: 50px;
  height: 50px;
  background: blue;
  margin-left: 10px;
  margin-top: 10px;
}
.onecont {
  width: 50px;
  height: 50px;
  background: green;
  margin-left: 10px;
  margin-top: 10px;
}
.member.on{
  color: aqua;
}
.member.on .one,.member.on .two,.member.on .three{
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: column-reverse;
  align-items: center;
}
</style>