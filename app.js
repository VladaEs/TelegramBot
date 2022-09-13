const { Telegraf, Markup, Scenes, session, Composer } = require('telegraf');

const comands = require('./comands');
require('dotenv').config()
const bot = new Telegraf(process.env.bot_token);
let subName = '';
let opisanie = '';
let cost = '';

bot.start((ctx) => ctx.replyWithHTML('Вас вітає 👋 бот телеграм каналу <b>"The Helper"</b>. Щоб дізнатися правила каналу, натисніть на відповідну кнопку у меню'));
bot.help((ctx) => ctx.reply(comands.comands));



const cancel = [
    ['Скасувати']
]

const hello = new Scenes.WizardScene('id',
    async (ctx) => {
        await ctx.reply('Введить назву предмету:', Markup.keyboard(cancel).resize())
        ctx.wizard.next()
    },
    async (ctx) => {
        if (ctx.message.text == 'Скасувати' || !ctx.message.text) {
            await ctx.reply('Скасувати')
            ctx.scene.leave()
        }
        subName = ctx.message.text;
        
        ctx.wizard.state.description = ctx.message.text
        await ctx.replyWithHTML('<b>Опишіть Ваше завдання максимально зрозуміло для виконавців</b> ')
        ctx.wizard.next()

    },
    async (ctx) => {
        if (ctx.message.text == 'Скасувати' || !ctx.message.text) {
            await ctx.reply('Скасувати')
            ctx.scene.leave()
        }
        opisanie = ctx.message.text;
        console.log(opisanie);
        ctx.wizard.state.description = ctx.message.text
        await ctx.reply('введіть ціну за завдання:', Markup.keyboard(cancel).resize())
        ctx.wizard.next()
    },
    async (ctx) => {
        cost = ctx.message.text
        console.log(cost)
        if (ctx.message.text == 'Скасувати' || !ctx.message.text  || isNaN(ctx.message.text)) {
            await ctx.reply('Скасувати')
            ctx.scene.leave()
        }
        ctx.wizard.state.price = ctx.message.text
        //тут шаблон ответа при создании задания
        await ctx.replyWithHTML(`🔵Активно

<b>${subName}</b>

${opisanie}

Ціна: ${cost}

#TheHelper`, Markup.removeKeyboard())
        ctx.replyWithHTML('<b>Скопіюйте це повідомлення, та відправте його адміну</b>')
        ctx.replyWithHTML("<a href='https://t.me/VladaEs'>Адміністратор</a>");
        
            ctx.scene.leave()
        
    }
)
const stage = new Scenes.Stage([hello])
bot.use(session())
bot.use(stage.middleware())

bot.command('/newtask', (ctx) => {
    ctx.scene.enter('id')
})

//выбор, быть исполнителем или учеником
bot.command('proof', async (ctx) => {
    try {
        await ctx.replyWithHTML('<b>натисніть сюди, якщо хочете створювати або виконувати завдання</b>', Markup.inlineKeyboard(
            [
            [Markup.button.callback('Я - виконавець', 'button_1_teacher')],
            [Markup.button.callback('Я - учень', 'button_2_student')],
            ]
        ))
    } catch (e) {
        console.error(e);
    }
})
bot.command('rules', async (ctx) => {
    try {
        await ctx.replyWithHTML('<b>Натисніть на кнопку знизу, щоб перейти на сторінку з правилами</b>', Markup.inlineKeyboard(
            [Markup.button.callback('Посилання', 'button_1_rules')]
        ))
    } catch (e) {
        console.error(e);
    }
})


//оброботчик кнопок 
bot.action('button_2_student', async (ctx) => {
    try {
        await ctx.answerCbQuery();
        await ctx.replyWithHTML("<b> Напишіть нашому <i>адміністратору</i>, який дасть Вам доступ до каналу</b>");
         ctx.replyWithHTML("<a href='https://t.me/VladaEs'>Адміністратор</a>");
    } catch (e) {
        console.error(e);
    }
})
bot.action('button_1_teacher', async (ctx) => {
    try {
        await ctx.answerCbQuery();
        await ctx.replyWithHTML("<b> Напишіть нашому <i>адміністратору</i>, який дасть Вам доступ до каналу</b>");
        ctx.replyWithHTML("<a href='https://t.me/VladaEs'>Адміністратор</a>");
    } catch (e) {
        console.error(e);
    }
})
bot.action('button_1_rules', async (ctx) => {
    try {
        await ctx.answerCbQuery()// что бы не было часиков на кнопке
        await ctx.replyWithHTML('<a href="https://telegra.ph/PRAVILA-SOOBSHCHESTVA-The-Helper-09-06-2">Перейдіть за посиланням</a>')
    } catch (e) {
        console.error(e);
    }
})





bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));



